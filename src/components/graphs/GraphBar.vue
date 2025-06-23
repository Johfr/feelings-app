<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
// import { colorsMeaning } from '@/composables/useColorsMeaning.js'
import { useColorStore } from '@/stores/colorStore'
import { Colors } from '@/types/Colors'

const store = useColorStore()
store.loadColors()
const colorsData = computed((): Colors[] => store.colorItems)

const props = defineProps<{
  colorStats: { color: string, qty: number }[]
}>()

const svgHeight = 200
const svgWidth = computed(() => Math.max(320, props.colorStats.length * 60))
const barWidth = 32
const barGap = 28
const leftPadding = 28
const bottomPadding = 55

const hoveredIndex = ref<number | null>(null)

const maxQty = computed(() => Math.max(...props.colorStats.map(c => c.qty), 1))
const unitHeight = computed(() => (svgHeight - bottomPadding - 50) / maxQty.value)

const getMeaning = (color: string) => {
  return colorsData.value.find(e => e.color === color)?.meaning || 'Aucune signification'
}

const tooltipLines = (text: string, maxChar = 22) => {
  if (!text) return ['']
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  words.forEach(word => {
    while (word.length > maxChar) {
      lines.push(word.slice(0, maxChar) + '-')
      word = word.slice(maxChar)
    }
    if ((line + word).length > maxChar) {
      lines.push(line.trim())
      line = word + ' '
    } else {
      line += word + ' '
    }
  })
  if (line.trim()) lines.push(line.trim())
  return lines
}

const getTextWidth = (() => {
  let canvas: HTMLCanvasElement | null = null
  let context: CanvasRenderingContext2D | null = null
  return (text: string, font = '13px Arial') => {
    if (!canvas) {
      canvas = document.createElement('canvas')
      context = canvas.getContext('2d')
    }
    if (!context) return 0
    context.font = font
    return context.measureText(text).width
  }
})()

function safeNum(val: any, fallback = 0) {
  return typeof val === 'number' && !isNaN(val) ? val : fallback
}

const animatedHeights = ref<number[]>([])
const animatedYs = ref<number[]>([])
const barAnimDuration = 500

function animateAllBars() {
  for (let i = 0; i < props.colorStats.length; i++) {
    animatedHeights.value[i] = 0
    animatedYs.value[i] = svgHeight - bottomPadding
    animateBar(i)
  }
}

function animateBar(i: number) {
  const item = props.colorStats[i]
  const targetHeight = item.qty * unitHeight.value
  const targetY = svgHeight - bottomPadding - targetHeight
  let start: number | null = null

  function step(ts: number) {
    if (!start) start = ts
    const progress = Math.min((ts - start) / barAnimDuration, 1)
    animatedHeights.value[i] = targetHeight * progress
    animatedYs.value[i] = svgHeight - bottomPadding - animatedHeights.value[i]
    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      animatedHeights.value[i] = targetHeight
      animatedYs.value[i] = targetY
    }
  }
  requestAnimationFrame(step)
}

// Tooltip params, calculés à partir du hoveredIndex
const tooltipParams = computed(() => {
  if (hoveredIndex.value === null) return null
  const i = hoveredIndex.value
  const item = props.colorStats[i]
  const text = getMeaning(item.color)
  const lines = tooltipLines(text)
  const textPaddingX = 12
  const textPaddingY = 7
  const lineHeight = 16

  const width = Math.max(...lines.map(line => getTextWidth(line))) + textPaddingX * 2
  const height = lines.length * lineHeight + textPaddingY * 2

  const barX = leftPadding + i * (barWidth + barGap) + barWidth / 2
  const barY = safeNum(animatedYs.value[i], svgHeight - bottomPadding)
  let x = barX - width / 2
  let y = barY - height - 10
  if (x < 2) x = 2
  if (x + width > svgWidth.value) x = svgWidth.value - width - 2
  if (y < 0) y = 0

  return { x, y, width, height, lines, textPaddingX, textPaddingY, lineHeight }
})

onMounted(animateAllBars)
watch(
  () => props.colorStats.map(c => c.qty).join(','),
  animateAllBars,
  { immediate: false }
)
</script>

<template>
  <svg
    :width="svgWidth"
    :height="svgHeight"
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
    xmlns="http://www.w3.org/2000/svg"
    style="overflow: visible"
  >
    <!-- GROUPES BARRES -->
    <g
      v-for="(item, i) in colorStats"
      :key="item.color"
      @mouseenter="hoveredIndex = i"
      @mouseleave="hoveredIndex = null"
      style="cursor:pointer"
    >
      <rect
        :x="leftPadding + i * (barWidth + barGap)"
        :y="safeNum(animatedYs[i], svgHeight - bottomPadding)"
        :width="barWidth"
        :height="safeNum(animatedHeights[i], 0)"
        :fill="item.color"
        rx="6"
      />
      <text
        :x="leftPadding + i * (barWidth + barGap) + barWidth/2"
        :y="safeNum(animatedYs[i] - 10, svgHeight - bottomPadding - 10)"
        text-anchor="middle"
        font-size="15"
        font-weight="bold"
        fill="#222"
        style="pointer-events: none"
      >
        {{ item.qty }}
      </text>
      <text
        :x="leftPadding + i * (barWidth + barGap) + barWidth/2"
        :y="svgHeight - 15"
        text-anchor="middle"
        font-size="12"
        fill="#333"
        style="pointer-events: none"
      >
        {{ item.color }}
      </text>
    </g>

    <!-- TOOLTIP, toujours affichée en dernier (donc au-dessus de tout) -->
    <g v-if="hoveredIndex !== null && tooltipParams">
      <g
        :transform="`translate(${tooltipParams.x},${tooltipParams.y})`"
      >
        <rect
          x="0"
          y="0"
          :width="tooltipParams.width"
          :height="tooltipParams.height"
          rx="10"
          fill="#fff"
          stroke="#bbb"
          stroke-width="1"
          opacity="0.97"
        />
        <text
          :x="tooltipParams.textPaddingX"
          :y="tooltipParams.textPaddingY + 13"
          font-size="13"
          fill="#1b1b1b"
          style="pointer-events: none"
        >
          <tspan
            v-for="(line, li) in tooltipParams.lines"
            :key="li"
            :x="tooltipParams.textPaddingX"
            :y="safeNum(tooltipParams.textPaddingY + 13 + li * tooltipParams.lineHeight, 24)"
          >{{ line }}</tspan>
        </text>
      </g>
    </g>
  </svg>
</template>

<style scoped>
svg {
  width: 100%;
}
</style>
