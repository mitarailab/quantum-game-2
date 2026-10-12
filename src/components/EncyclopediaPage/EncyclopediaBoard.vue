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
    <KetViewer
      v-if="playheadCtl.activeFrame"
      class="ket"
      :vector="playheadCtl.activeFrame?.vector"
      :polBasis="polBasis"
    />
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

    return { gameCtl, playheadCtl, laserParticles, polBasis, updateRotation, totalAbsorptions }
  },
})
</script>

<style lang="scss" scoped>
.board,
.ket {
  width: 360px;
}

.ket {
  padding: 5px 10px;
  margin-top: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
