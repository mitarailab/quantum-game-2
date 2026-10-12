<template>
  <div v-if="gameCtl.level" class="container" layout="column center u1">
    <Board
      class="board"
      :absorptions="totalAbsorptions"
      :board="gameCtl.level.board"
      :laserParticles="laserParticles"
      :particles="playheadCtl.interpolatedParticles"
      @touch="updateRotation"
    />
    <details class="photon-state">
      <summary>{{ $gameText('Photon state (formula)') }}</summary>
      <div class="state-panel">
        <KetViewer
          v-if="playheadCtl.activeFrame"
          class="ket"
          :vector="playheadCtl.activeFrame.vector"
          :polBasis="polBasis"
        />
        <p v-if="!hasPhotons" class="empty-state">
          {{ $gameText('There are no photons on the board at this step.') }}
        </p>
      </div>
    </details>
  </div>
</template>

<script lang="ts">
import { KetViewer } from '@/components/QuantumStateViews'
import Board from '@/components/Board/index.vue'
import { computed, defineComponent, PropType, watch, watchEffect } from 'vue'
import { gameController, playheadController } from '@/engine/controller'
import { IGrid } from '@/engine/interfaces'
import { Coord, Rotation, Vector } from '@/engine/model'

export default defineComponent({
  components: {
    Board,
    KetViewer,
  },
  props: {
    grid: { type: Object as PropType<IGrid>, required: true },
    vector: { type: Object as PropType<Vector>, required: false },
    maxSteps: { type: Number, required: false },
  },
  emits: {
    rotated: (_: Rotation) => true,
  },
  setup(props, { emit }) {
    const gameCtl = gameController({
      initialState: () => props.vector,
      maxSteps: () => props.maxSteps,
    })

    watchEffect(() => {
      gameCtl.importLevel({ grid: props.grid })
    })

    const playheadCtl = playheadController({
      frames: () => gameCtl.sim?.frames ?? [],
      loop: true,
    })

    // Replay automatically, including after rotating a component or changing the input state.
    watch(
      () => playheadCtl.frames,
      (frames) => {
        playheadCtl.rewind(true)
        if (frames.length > 1) playheadCtl.play({ interval: 600 })
      },
      { immediate: true }
    )

    const laserParticles = computed(() => {
      return gameCtl.sim?.frames.flatMap((f) => f.particles) ?? []
    })

    const polBasis = computed(() => {
      return props.vector?.dimensions.find((d) => d.name === 'polarization')?.coordString ?? 'HV'
    })

    const hasPhotons = computed(() => {
      return (playheadCtl.activeFrame?.vector.normSquared() ?? 0) > 1e-8
    })

    const totalAbsorptions = computed(() => {
      let absorptions = gameCtl.sim?.upToFrameAbsorptions ?? []
      return absorptions[absorptions.length - 1] ?? new Map()
    })

    function updateRotation(coord: Coord) {
      gameCtl.rotateCcw(coord)
      const piece = gameCtl.level?.board.pieces.get(coord)
      if (piece != null && 'rotation' in piece) {
        emit('rotated', piece.rotation)
      }
    }

    return {
      gameCtl,
      playheadCtl,
      laserParticles,
      polBasis,
      hasPhotons,
      updateRotation,
      totalAbsorptions,
    }
  },
})
</script>

<style lang="scss" scoped>
.board {
  width: 360px;
}

.photon-state {
  width: 360px;
  max-width: 100%;
  margin-top: 5px;
  background-color: rgba(0, 0, 0, 0.1);

  summary {
    padding: 10px 12px;
    cursor: pointer;
    font-size: 14px;
  }
}

.state-panel {
  position: relative;
  height: 220px;
  overflow: auto;
  padding: 0 12px 12px;
  box-sizing: border-box;
}

.ket {
  width: 100%;
  justify-content: flex-start;
  transition: none;

  ::v-deep(.quantum-state-viewer) {
    height: 96px;
    flex: 0 0 96px;
    width: 100%;
    overflow: auto;
    align-content: flex-start;
    font-size: 16px;
  }

  ::v-deep(.legend-dark),
  ::v-deep(.legend-bright) {
    font-size: 12px;
  }
}

.empty-state {
  position: absolute;
  top: 0;
  left: 12px;
  right: 12px;
  margin: 0;
  padding: 12px 0;
  font-size: 14px;
  line-height: 1.6;
  pointer-events: none;
}
</style>
