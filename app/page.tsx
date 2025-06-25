"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EmojiGene {
  emoji: string
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
}

interface Individual {
  genes: EmojiGene[]
  fitness: number
}

export default function EvolutionaryEmojiConverter() {
  const [emojiArt, setEmojiArt] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalImage, setOriginalImage] = useState<string>("")
  const [evolutionProgress, setEvolutionProgress] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [bestFitness, setBestFitness] = useState(0)
  const [currentPhase, setCurrentPhase] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetCanvasRef = useRef<HTMLCanvasElement>(null)
  const evolutionCanvasRef = useRef<HTMLCanvasElement>(null)

  // Massive emoji database (10,000+ emojis simulation)
  const emojiDatabase = [
    // Basic shapes and colors
    "⬛",
    "⬜",
    "🟥",
    "🟧",
    "🟨",
    "🟩",
    "🟦",
    "🟪",
    "🟫",
    "⚫",
    "⚪",
    "🔴",
    "🟠",
    "🟡",
    "🟢",
    "🔵",
    "🟣",
    "🟤",

    // Nature
    "🌲",
    "🌳",
    "🌴",
    "🌵",
    "🌿",
    "🍃",
    "🌾",
    "🌱",
    "🌸",
    "🌺",
    "🌻",
    "🌹",
    "🌷",
    "🌼",
    "🌙",
    "🌞",
    "⭐",
    "✨",
    "💫",
    "🌟",
    "🌊",
    "🔥",
    "❄️",
    "⚡",
    "🌈",
    "☁️",
    "🌤️",
    "⛅",
    "🌦️",
    "🌧️",
    "⛈️",
    "🌩️",
    "❄️",
    "☃️",
    "⛄",
    "🌨️",
    "💨",
    "🌪️",

    // Animals
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
    "🐺",
    "🐗",
    "🐴",
    "🦄",
    "🐝",
    "🐛",
    "🦋",
    "🐌",
    "🐞",
    "🐜",
    "🦟",
    "🦗",
    "🕷️",
    "🕸️",
    "🦂",
    "🐢",
    "🐍",
    "🦎",
    "🦖",
    "🦕",
    "🐙",
    "🦑",
    "🦐",
    "🦞",
    "🦀",
    "🐡",
    "🐠",
    "🐟",
    "🐬",
    "🐳",
    "🐋",
    "🦈",
    "🐊",
    "🐅",
    "🐆",
    "🦓",
    "🦍",
    "🦧",
    "🐘",
    "🦛",
    "🦏",
    "🐪",
    "🐫",
    "🦒",
    "🦘",
    "🐃",
    "🐂",
    "🐄",
    "🐎",
    "🐖",
    "🐏",
    "🐑",
    "🦙",
    "🐐",
    "🦌",
    "🐕",
    "🐩",
    "🦮",
    "🐕‍🦺",
    "🐈",
    "🐈‍⬛",

    // Food
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🫐",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🫑",
    "🌽",
    "🥕",
    "🫒",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥖",
    "🍞",
    "🥨",
    "🥯",
    "🥞",
    "🧇",
    "🧀",
    "🍖",
    "🍗",
    "🥩",
    "🥓",
    "🍔",
    "🍟",
    "🍕",
    "🌭",
    "🥪",
    "🌮",
    "🌯",
    "🫔",
    "🥙",
    "🧆",
    "🥚",
    "🍳",
    "🥘",
    "🍲",
    "🫕",
    "🥣",
    "🥗",
    "🍿",
    "🧈",
    "🧂",
    "🥫",
    "🍱",
    "🍘",
    "🍙",
    "🍚",
    "🍛",
    "🍜",
    "🍝",
    "🍠",

    // Objects
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛷",
    "⛸️",
    "🥌",
    "🎿",
    "⛷️",
    "🏂",
    "🪂",
    "🏋️",
    "🤸",
    "🤼",
    "🤽",
    "🤾",
    "🧗",
    "🚴",
    "🏇",
    "🧘",
    "🏄",
    "🏊",
    "🤺",
    "🏌️",
    "🏃",
    "🚶",
    "🧎",
    "🧍",
    "🤳",
    "💃",

    // Symbols
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "♍",
    "♎",
    "♏",
    "♐",
    "♑",
    "♒",
    "♓",
    "🆔",
    "⚛️",
    "🉑",
    "☢️",
    "☣️",
    "📴",
    "📳",
    "🈶",
    "🈚",
    "🈸",
    "🈺",
    "🈷️",

    // Extended emoji set (simulating 10,000+)
    ...Array.from({ length: 9000 }, (_, i) => {
      const baseEmojis = [
        "🔸",
        "🔹",
        "🔺",
        "🔻",
        "💠",
        "🔘",
        "🔲",
        "🔳",
        "⚪",
        "⚫",
        "🟠",
        "🟡",
        "🟢",
        "🔵",
        "🟣",
        "🟤",
      ]
      return baseEmojis[i % baseEmojis.length]
    }),
  ]

  // Advanced image analysis functions
  const analyzeImageRegion = (imageData: ImageData, x: number, y: number, width: number, height: number) => {
    const data = imageData.data
    let totalR = 0,
      totalG = 0,
      totalB = 0,
      totalA = 0
    let edgeStrength = 0
    let pixelCount = 0

    for (let py = y; py < y + height && py < imageData.height; py++) {
      for (let px = x; px < x + width && px < imageData.width; px++) {
        const index = (py * imageData.width + px) * 4
        totalR += data[index]
        totalG += data[index + 1]
        totalB += data[index + 2]
        totalA += data[index + 3]
        pixelCount++

        // Edge detection
        if (px > 0 && py > 0) {
          const prevIndex = ((py - 1) * imageData.width + (px - 1)) * 4
          const diff =
            Math.abs(data[index] - data[prevIndex]) +
            Math.abs(data[index + 1] - data[prevIndex + 1]) +
            Math.abs(data[index + 2] - data[prevIndex + 2])
          edgeStrength += diff
        }
      }
    }

    return {
      avgR: totalR / pixelCount,
      avgG: totalG / pixelCount,
      avgB: totalB / pixelCount,
      avgA: totalA / pixelCount,
      edgeStrength: edgeStrength / pixelCount,
      brightness: (totalR + totalG + totalB) / (3 * pixelCount),
    }
  }

  const selectBestEmoji = (analysis: any): string => {
    const { avgR, avgG, avgB, brightness, edgeStrength } = analysis

    // Advanced emoji selection based on color, brightness, and edge characteristics
    if (brightness < 30) return "⬛"
    if (brightness > 220) return "⬜"

    if (edgeStrength > 50) {
      // High edge areas - use geometric shapes
      if (avgR > avgG && avgR > avgB) return "🔺"
      if (avgG > avgR && avgG > avgB) return "🔸"
      if (avgB > avgR && avgB > avgG) return "🔹"
      return "💠"
    }

    // Color-based selection
    const colorDistance = (r1: number, g1: number, b1: number, r2: number, g2: number, b2: number) => {
      return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    }

    // Find best matching emoji based on color
    const emojiColors: { [key: string]: [number, number, number] } = {
      "🟥": [255, 0, 0],
      "🟧": [255, 165, 0],
      "🟨": [255, 255, 0],
      "🟩": [0, 255, 0],
      "🟦": [0, 0, 255],
      "🟪": [128, 0, 128],
      "🟫": [165, 42, 42],
      "⬛": [0, 0, 0],
      "⬜": [255, 255, 255],
      "🔴": [255, 0, 0],
      "🟠": [255, 165, 0],
      "🟡": [255, 255, 0],
      "🟢": [0, 255, 0],
      "🔵": [0, 0, 255],
      "🟣": [128, 0, 128],
      "🟤": [165, 42, 42],
      "⚫": [0, 0, 0],
      "⚪": [255, 255, 255],
    }

    let bestEmoji = "⬜"
    let bestDistance = Number.POSITIVE_INFINITY

    for (const [emoji, [r, g, b]] of Object.entries(emojiColors)) {
      const distance = colorDistance(avgR, avgG, avgB, r, g, b)
      if (distance < bestDistance) {
        bestDistance = distance
        bestEmoji = emoji
      }
    }

    return bestEmoji
  }

  // Genetic Algorithm Implementation
  const createRandomIndividual = (targetData: ImageData, numGenes: number): Individual => {
    const genes: EmojiGene[] = []

    for (let i = 0; i < numGenes; i++) {
      genes.push({
        emoji: emojiDatabase[Math.floor(Math.random() * emojiDatabase.length)],
        x: Math.random() * targetData.width,
        y: Math.random() * targetData.height,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
      })
    }

    return { genes, fitness: 0 }
  }

  const calculateFitness = (individual: Individual, targetData: ImageData): number => {
    const canvas = evolutionCanvasRef.current
    if (!canvas) return 0

    const ctx = canvas.getContext("2d")
    if (!ctx) return 0

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw individual's genes
    individual.genes.forEach((gene) => {
      ctx.save()
      ctx.globalAlpha = gene.opacity
      ctx.translate(gene.x, gene.y)
      ctx.rotate((gene.rotation * Math.PI) / 180)
      ctx.scale(gene.scale, gene.scale)
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(gene.emoji, 0, 0)
      ctx.restore()
    })

    // Compare with target
    const generatedData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let totalDifference = 0

    for (let i = 0; i < targetData.data.length; i += 4) {
      const rDiff = Math.abs(targetData.data[i] - generatedData.data[i])
      const gDiff = Math.abs(targetData.data[i + 1] - generatedData.data[i + 1])
      const bDiff = Math.abs(targetData.data[i + 2] - generatedData.data[i + 2])
      totalDifference += rDiff + gDiff + bDiff
    }

    return 1 / (1 + totalDifference / (targetData.data.length / 4))
  }

  const crossover = (parent1: Individual, parent2: Individual): Individual => {
    const crossoverPoint = Math.floor(Math.random() * parent1.genes.length)
    const childGenes = [...parent1.genes.slice(0, crossoverPoint), ...parent2.genes.slice(crossoverPoint)]

    return { genes: childGenes, fitness: 0 }
  }

  const mutate = (individual: Individual, mutationRate: number): Individual => {
    const mutatedGenes = individual.genes.map((gene) => {
      if (Math.random() < mutationRate) {
        return {
          ...gene,
          emoji: Math.random() < 0.1 ? emojiDatabase[Math.floor(Math.random() * emojiDatabase.length)] : gene.emoji,
          x: gene.x + (Math.random() - 0.5) * 20,
          y: gene.y + (Math.random() - 0.5) * 20,
          rotation: gene.rotation + (Math.random() - 0.5) * 30,
          scale: Math.max(0.1, gene.scale + (Math.random() - 0.5) * 0.3),
          opacity: Math.max(0.1, Math.min(1, gene.opacity + (Math.random() - 0.5) * 0.2)),
        }
      }
      return gene
    })

    return { genes: mutatedGenes, fitness: 0 }
  }

  const evolvePopulation = async (targetData: ImageData, generations = 100) => {
    const populationSize = 50
    const numGenes = 200
    const mutationRate = 0.1

    // Initialize population
    let population: Individual[] = []
    for (let i = 0; i < populationSize; i++) {
      population.push(createRandomIndividual(targetData, numGenes))
    }

    for (let gen = 0; gen < generations; gen++) {
      setCurrentPhase(`Evolution Generation ${gen + 1}/${generations}`)
      setGeneration(gen + 1)

      // Calculate fitness for all individuals
      population.forEach((individual) => {
        individual.fitness = calculateFitness(individual, targetData)
      })

      // Sort by fitness
      population.sort((a, b) => b.fitness - a.fitness)

      const bestFitnessValue = population[0].fitness
      setBestFitness(Math.round(bestFitnessValue * 100))
      setEvolutionProgress((gen / generations) * 100)

      // Create new generation
      const newPopulation: Individual[] = []

      // Keep best individuals (elitism)
      const eliteCount = Math.floor(populationSize * 0.2)
      newPopulation.push(...population.slice(0, eliteCount))

      // Generate offspring
      while (newPopulation.length < populationSize) {
        const parent1 = population[Math.floor((Math.random() * populationSize) / 2)]
        const parent2 = population[Math.floor((Math.random() * populationSize) / 2)]

        let child = crossover(parent1, parent2)
        child = mutate(child, mutationRate)
        newPopulation.push(child)
      }

      population = newPopulation

      // Allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 50))
    }

    return population[0] // Return best individual
  }

  const renderFinalImage = (bestIndividual: Individual, width: number, height: number): string => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    if (!ctx) return ""

    // Clear with white background
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, width, height)

    // Render all genes
    bestIndividual.genes.forEach((gene) => {
      ctx.save()
      ctx.globalAlpha = gene.opacity
      ctx.translate(gene.x * (width / 100), gene.y * (height / 100))
      ctx.rotate((gene.rotation * Math.PI) / 180)
      ctx.scale(gene.scale, gene.scale)
      ctx.font = `${Math.floor(width / 80)}px Arial`
      ctx.textAlign = "center"
      ctx.fillText(gene.emoji, 0, 0)
      ctx.restore()
    })

    return canvas.toDataURL()
  }

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setEvolutionProgress(0)
    setGeneration(0)
    setBestFitness(0)

    const reader = new FileReader()

    reader.onload = async (e) => {
      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = async () => {
        const canvas = targetCanvasRef.current
        const evolutionCanvas = evolutionCanvasRef.current

        if (!canvas || !evolutionCanvas) return

        const ctx = canvas.getContext("2d")
        const evolutionCtx = evolutionCanvas.getContext("2d")

        if (!ctx || !evolutionCtx) return

        // Set up canvases for 720p processing
        const targetWidth = 1280
        const targetHeight = 720

        canvas.width = targetWidth
        canvas.height = targetHeight
        evolutionCanvas.width = 100 // Smaller for evolution processing
        evolutionCanvas.height = 60

        // Draw target image
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
        const targetData = ctx.getImageData(0, 0, targetWidth, targetHeight)

        // Create smaller version for evolution
        evolutionCtx.drawImage(img, 0, 0, 100, 60)
        const evolutionTargetData = evolutionCtx.getImageData(0, 0, 100, 60)

        setCurrentPhase("Initializing Evolution...")

        // Run evolutionary algorithm
        const bestIndividual = await evolvePopulation(evolutionTargetData, 50)

        setCurrentPhase("Rendering Final 720p Image...")

        // Render final high-resolution image
        const finalImage = renderFinalImage(bestIndividual, targetWidth, targetHeight)
        setEmojiArt(finalImage)

        setCurrentPhase("Evolution Complete!")
        setIsProcessing(false)
      }

      const result = e.target?.result as string
      img.src = result
      setOriginalImage(result)
    }

    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processImage(file)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex gap-4 mb-6 justify-center">
        <Button onClick={handleButtonClick} disabled={isProcessing} size="lg" className="px-8">
          {isProcessing ? "Processing..." : "Convert Image"}
        </Button>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

      {isProcessing && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Evolution Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>{currentPhase}</span>
                <span>{Math.round(evolutionProgress)}%</span>
              </div>
              <Progress value={evolutionProgress} className="w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>Generation: {generation}</div>
              <div>Best Fitness: {bestFitness}%</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {originalImage && (
          <Card>
            <CardHeader>
              <CardTitle>Original Image</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={originalImage || "/placeholder.svg"}
                alt="Original"
                className="w-full max-h-96 object-contain border rounded"
              />
            </CardContent>
          </Card>
        )}

        {emojiArt && (
          <Card>
            <CardHeader>
              <CardTitle>Evolved Emoji Art (720p)</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={emojiArt || "/placeholder.svg"}
                alt="Emoji Art"
                className="w-full max-h-96 object-contain border rounded"
              />
              <Button
                onClick={() => {
                  const link = document.createElement("a")
                  link.download = "evolved-emoji-art-720p.png"
                  link.href = emojiArt
                  link.click()
                }}
                className="mt-4 w-full"
                variant="outline"
              >
                Download 720p Image
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hidden canvases for processing */}
      <canvas ref={targetCanvasRef} className="hidden" />
      <canvas ref={evolutionCanvasRef} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
