import * as THREE from 'three'
import { disposeHelper } from '../lib/dispose'
import type { Pane } from '../pane'

export const addForwardHelperInput = (pane: Pane, object3D: THREE.Object3D) => {
  const helper = new THREE.ArrowHelper()
  helper.setLength(1)

  const params = {
    forwardHelper: false,
  }

  pane.addInput(params, 'forwardHelper').on('change', () => {
    if (params.forwardHelper) {
      object3D.add(helper)
    } else {
      object3D.remove(helper)
    }
  })

  return () => {
    object3D.remove(helper)
    disposeHelper(helper as unknown as THREE.Line)
  }
}
