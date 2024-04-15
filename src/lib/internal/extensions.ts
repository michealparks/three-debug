import { getContext, onDestroy, setContext } from 'svelte'
import { createActions } from './actions'
import { createKeyboardControls, hotkeyFns } from './keyboard'
import { createState } from './state.svelte'
import { beforeUnload } from './useBeforeUnload'

type ExtensionAction = <ExtensionState extends Record<string, unknown>>(
	state: ExtensionState,
	...args: any[]
) => Promise<void> | void

type ExtensionActions = Record<string, ExtensionAction>

export const createRootContext = () => {
	const state = createState()
	const actions = createActions()
	const keyboardControls = createKeyboardControls((scope, actionId) => {
		actions.runAction(scope, actionId, state.getScopedState(scope).state)
	})

	const getExtension = <
		State extends Record<string, unknown>,
		Actions extends Record<string, (...args: any[]) => Promise<void> | void>,
		NonPartial extends boolean = false,
	>(
		scope: string,
	) => {
		const run = <K extends keyof Actions>(id: K, ...args: Parameters<Actions[K]>) => {
			actions.runAction(scope, id as string, state.getScopedState<State>(scope).state, ...args)
		}

		return {
			get state() {
				return state.getScopedState<State, NonPartial>(scope).state
			},
			run,
		}
	}

	const removeExtension = (scope: string) => {
		state.persistState(scope)
		state.removeScopedState(scope)
		actions.removeExtensionActions(scope)
		keyboardControls.removeKeys(scope)
	}

	const useExtension = <
		State extends Record<string, unknown>,
		Actions extends Record<string, (...args: any[]) => Promise<void> | void>,
	>(options: {
		scope: string
		state: (args: { persist: <T>(value: T) => T }) => State
		actions: {
			[K in keyof Actions]: (
				params: {
					state: State
				},
				...args: Parameters<Actions[K]>
			) => ReturnType<Actions[K]>
		}
		keyMap?: (utils: typeof hotkeyFns) => {
			[Key in keyof Actions]?: Parameters<Actions[Key]> extends []
				? string | string[] | { up?: string | string[]; down?: string | string[] }
				: never
		}
	}) => {
		state.addExtensionState(options.scope, options.state)
		actions.addExtensionActions(options.scope, options.actions as unknown as ExtensionActions)
		if (options.keyMap) {
			const keyMap = options.keyMap(hotkeyFns)
			keyboardControls.addKeys(options.scope, keyMap)
		}

		onDestroy(() => {
			removeExtension(options.scope)
		})

		return getExtension<State, Actions, true>(options.scope)
	}

	const context = {
		state,
		actions,
		useExtension,
		getExtension,
	}

	setContext('threlte:studio:extensions', context)

	// the last thing to do before the window is being closed is to persist the
	// state to the local storage
	beforeUnload(state.persistState, true)

	return context
}

export const useStudio = () => {
	return getContext<ReturnType<typeof createRootContext>>('threlte:studio:extensions')
}
