/* eslint-disable max-classes-per-file */

import type { Color, Euler, Vector3 } from 'three'
import { clientRpc } from './vite-plugin/clientRpc'

export type SyncRequest = {
	/** The name of the component attribute, e.g. `"position"` or `"position.x"` */
	attributeName: string
	/** The value of the component attribute derived by the value of the transaction */
	attributeValue: any
	/** The index of the component */
	componentIndex: number
	/** The module id of the component */
	moduleId: string
	/** The signature of the component */
	signature: string
	/** The decimal precision of floats, defaults to 4 */
	precision?: number
}

const parser = {
	isVector3: (value: Vector3) => [value.x, value.y, value.z],
	isEuler: (value: Euler) => [value.x, value.y, value.z],
	isColor: (value: Color) => `#${value.getHexString()}`,
} satisfies Record<string, (value: any) => any>

export type Transaction<T, U> = {
	/** The object to modify */
	object: T
	/** The value of the transaction */
	value: U
	/** Read from the object into a serializable format */
	read: (root: T) => U
	/** Write a value on the object from the format resolved by the read property */
	write: (root: T, data: U) => void
	/** The sync configuration */
	sync?: Omit<SyncRequest, 'attributeValue'>
}

export type TransactionQueueCommitArgs = Transaction<any, any>[]

type TransactionQueueItem = Transaction<any, any> & {
	historicValue: any
}

/**
 * The TransactionQueue class is a queue of transactions that can be undone and
 * redone. A transaction is a change to a value that can be undone and redone.
 * The root of a transaction as well as the data is completely arbitrary.
 *
 * ### Committing a transaction
 *
 * To commit a transaction, you must provide the root object, the data to write,
 * a function to read the data from the root object, and a function to write the
 * data to the root object.
 *
 * @example
 * Single object in single commit
 * ```ts
 * const obj = {
 *   foo: {
 * 		 bar: 'baz',
 * 	 },
 * }
 *
 * const transactionQueue = new TransactionQueue()
 * transactionQueue.commit(
 *   obj,
 *   'quo',
 *   (obj) => obj.foo.bar,
 *   (obj, value) => (obj.foo.bar = value),
 * )
 *
 * expect(obj.foo.bar).toBe('quo')
 * ```
 *
 * @example
 * Multiple objects in single commit
 * ```ts
 * const arr = [{ foo: 'bar' }, { foo: 'baz' }]
 *
 * const transactionQueue = new TransactionQueue()
 * transactionQueue.commit(
 *   arr,
 *   arr.map(() => 'qux'),
 *   (arr) => arr.map((obj) => obj.foo),
 *   (arr, data) => arr.forEach((obj, i) => (obj.foo = data[i])),
 * )
 *
 * expect(arr[0].foo).toBe('qux')
 * expect(arr[1].foo).toBe('qux')
 * ```
 */
export class TransactionQueue {
	/** Queue of transactions that have been commited and can be undone */
	private commitedQueue: TransactionQueueItem[][] = $state([])
	/** Queue of transactions that have been undone and can be redone */
	private undoneQueue: TransactionQueueItem[][] = $state([])

	public syncQueue: SyncRequest[] = $state([])

	private syncTimeout: ReturnType<typeof setTimeout> | undefined

	constructor(
		public onCommit?: () => void,
		public onUndo?: () => void,
		public onRedo?: () => void,
	) {}

	commit(transactions: TransactionQueueCommitArgs) {
		const transactionQueueItems: TransactionQueueItem[] = transactions.map((transaction) => {
			return {
				...transaction,
				historicValue: transaction.read(transaction.object),
			}
		})
		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.value)
		})

		this.commitedQueue.push(transactionQueueItems)
		this.undoneQueue = []
		this.onCommit?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.addSyncRequest({
					...transaction.sync,
					attributeValue: transaction.value,
				})
			}
		})
	}

	undo() {
		const transactions = this.commitedQueue.pop()
		if (!transactions) return

		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.historicValue)
		})

		this.undoneQueue.push(transactions)
		this.onUndo?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.addSyncRequest({
					...transaction.sync,
					attributeValue: transaction.historicValue,
				})
			}
		})
	}

	redo() {
		const transactions = this.undoneQueue.pop()
		if (!transactions) return

		transactions.forEach((transaction) => {
			transaction.write(transaction.object, transaction.value)
		})

		this.commitedQueue.push(transactions)
		this.onRedo?.()

		transactions.forEach((transaction) => {
			if (transaction.sync) {
				this.addSyncRequest({
					...transaction.sync,
					attributeValue: transaction.value,
				})
			}
		})
	}

	addSyncRequest(request: SyncRequest) {
		// transform the value based on the parser type
		let value = request.attributeValue
		Object.entries(parser).forEach(([key, parse]) => {
			if (typeof value === 'object' && value !== null && key in value) {
				value = parse(value)
			}
		})
		this.syncQueue.push({
			...request,
			attributeValue: value,
		})
	}

	sync() {
		if (this.syncTimeout) clearTimeout(this.syncTimeout)
		this.syncTimeout = setTimeout(() => this.doSync(), 300)
	}

	private async doSync() {
		while (this.syncQueue.length > 0) {
			await clientRpc?.syncTransactions(this.syncQueue)
			this.syncQueue = []
		}
	}
}
