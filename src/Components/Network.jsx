import React from 'react'

const NEURON_SIDE = 45
const NEURONS_MARGIN_VERTICAL = 100
const LAYER_BOXES_MARGIN_HORIZONTAL = 150
const MAX_EDGE_WIDTH = 5
const MAX_FONT_SIZE = 20

const Network = function ({ topology, weights, inputs = [], activeLayers = [], allLayersActive = true }) {
    if (activeLayers.length > 0) {
        allLayersActive = false
    }

    const networkHeight = Math.max(...topology)
    const networkHeightPixels = networkHeight * (NEURON_SIDE + NEURONS_MARGIN_VERTICAL)
    const networkWidthPixels = topology.length * (NEURON_SIDE + LAYER_BOXES_MARGIN_HORIZONTAL) + LAYER_BOXES_MARGIN_HORIZONTAL
    const neuronsCoordinates = []

    const layerBoxes = topology.map((_, i) => {
        return <rect
            key={ i }
            x={ LAYER_BOXES_MARGIN_HORIZONTAL + (i * (NEURON_SIDE + LAYER_BOXES_MARGIN_HORIZONTAL)) }
            y={ NEURONS_MARGIN_VERTICAL }
            width={ NEURON_SIDE }
            height={ networkHeightPixels }
            fill='rgba(10, 10, 10, 0.0)'
            stroke='red'/>
    })

    const neurons = topology.map((n, i) => {
        let layerNeurons = []
        const measure = networkHeightPixels / n
        const opacity = allLayersActive || activeLayers.includes(i)
            ? 1.0
            : 0.6

        for (let j = 0; j < n; j++) {
            const cx = (i * (NEURON_SIDE + LAYER_BOXES_MARGIN_HORIZONTAL)) + LAYER_BOXES_MARGIN_HORIZONTAL + (NEURON_SIDE / 2)
            const cy = ((j + 1) * measure) - (measure / 2) + NEURONS_MARGIN_VERTICAL

            let layer = neuronsCoordinates[i]
            if (undefined === layer) {
                neuronsCoordinates.push([])
            }
            layer = neuronsCoordinates[i]
            layer.push({ x: cx, y: cy })

            layerNeurons.push(<circle
                key={ `${ i }${ j }` }
                cx={ cx }
                cy={ cy }
                r={ NEURON_SIDE / 2 }
                stroke='black'
                strokeWidth='1'
                fill='red'
                opacity={ opacity }
            />)

            const input = inputs[i] && inputs[i][j]
            if (undefined !== input) {
                layerNeurons.push(<text
                    key={ `c${ i }${ j }` }
                    x={ cx }
                    y={ cy }
                    className='small'
                    textAnchor='middle'
                    alignmentBaseline='middle'
                    fill='white'
                    opacity={ opacity }
                >{ (Math.round(input * 100) / 100).toFixed(1) }</text>)
            }
        }
        return layerNeurons
    })

    const edges = []
    for (let i = 0; i < neuronsCoordinates.length - 1; i++) {
        const currentLayer = neuronsCoordinates[i]
        const nextLayer = neuronsCoordinates[i + 1]

        const layerWeights = weights[i]
        const maxWeight = Math.max(...layerWeights.flatMap(x => x).map(x => Math.abs(x)))
        const weightRatio = MAX_EDGE_WIDTH / maxWeight
        const opacityRatio = 1.0 / maxWeight
        const fontSizeRatio = MAX_FONT_SIZE / maxWeight

        currentLayer.forEach((from, currIdx) => {
            nextLayer.forEach((to, nextIdx) => {
                let w = layerWeights[nextIdx][currIdx]
                edges.push(<line
                    key={ `l${ i }l${ i + 1 }f${ currIdx }t${ nextIdx }` }
                    x1={ from.x }
                    y1={ from.y }
                    x2={ to.x }
                    y2={ to.y }
                    stroke='black'
                    strokeWidth={ Math.abs(w) * weightRatio }
                    opacity={ Math.abs(w) * opacityRatio }
                />)

                edges.push(<circle
                    key={ `wlc${ i }l${ i + 1 }f${ currIdx }t${ nextIdx }` }
                    cx={ (from.x + to.x) / 2 }
                    cy={ (from.y + to.y) / 2 }
                    r={ Math.abs(w) * fontSizeRatio }
                    stroke='black'
                    strokeWidth='1'
                    fill='white'
                />)

                edges.push(<text key={ `wl${ i }l${ i + 1 }f${ currIdx }t${ nextIdx }` }
                    x={ (from.x + to.x) / 2 }
                    y={ (from.y + to.y) / 2 }
                    fontSize={ Math.abs(w) * fontSizeRatio }
                    opacity={ Math.abs(w) * opacityRatio }
                    textAnchor='middle'
                    alignmentBaseline='middle'
                >{ w.toFixed(2) }</text>)
            })
        })
    }

    return <svg key='svg'
        width={ networkWidthPixels }
        height={ networkHeightPixels + (2 * NEURONS_MARGIN_VERTICAL) }
    >
        {/*{ layerBoxes }*/ }
        { edges }
        { neurons }
    </svg>
}

export default Network
