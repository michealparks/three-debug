import { useStudio } from '../../internal/extensions'
import { spaceScope, type SpaceActions, type SpaceState } from './types'

export const useSpace = () => {
	const { getExtension } = useStudio()

	const extension = getExtension<SpaceState, SpaceActions>(spaceScope)

	const setSpace = (space: SpaceState['space']) => {
		extension.run('setSpace', space)
	}

	const toggleSpace = () => {
		extension.run('toggleSpace')
	}

	return {
		get space() {
			return extension.state.space
		},
		setSpace,
		toggleSpace,
	}
}
