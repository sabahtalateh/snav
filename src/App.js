import React from 'react'
import fs from 'fs'
import Network from './Components/Network'

class App extends React.Component {
    playInterval = null
    playSpeed = 300
    playDirection = null

    constructor(props, context) {
        super(props, context)
        this.state = {
            epoch: 0,
            networkLoaded: false,
            networkFiles: '/Users/sabahtalateh/Code/snav/networks/1/',
            topology: null,
            epochsDir: null,
            epochsFiles: []
        }
    }

    loadNetwork = () => {
        const path = this.state.networkFiles
        const topologyPath = `${ path }/topology.json`
        const epochsDir = `${ path }/epochs`
        if (fs.existsSync(path) && fs.existsSync(topologyPath) && fs.existsSync(epochsDir)) {
            const topology = JSON.parse(fs.readFileSync(topologyPath).toString())
            const epochsFiles = fs.readdirSync(epochsDir)

            this.setState({
                networkLoaded: true,
                topology,
                epochsDir,
                epochsFiles
            })
        }
    }

    changeNetworkFiles = (e) => {
        this.setState({
            networkFiles: e.target.value
        })
    }

    clearPlay = () => {
        clearInterval(this.playInterval)
        this.playInterval = null
        this.playDirection = null
    }

    play = () => {
        this.clearPlay()
        this.playDirection = 'forward'
        this.playInterval = setInterval(() => {
            this.forward()
        }, this.playSpeed)
    }

    rewind = () => {
        this.clearPlay()
        this.playDirection = 'backward'
        this.playInterval = setInterval(() => {
            this.backward()
        }, this.playSpeed)
    }

    stop = () => {
        this.clearPlay()
    }

    forward = () => {
        this.changeEpoch('inc')
    }

    backward = () => {
        this.changeEpoch('dec')
    }

    changeEpoch = (direction) => {
        const newEpoch = direction === 'inc' ? this.state.epoch + 1 : this.state.epoch - 1
        let epochFile = `${ this.state.epochsDir }/${ this.state.epochsFiles[newEpoch] }`
        if (fs.existsSync(epochFile)) {
            this.setState({ epoch: newEpoch })
        } else {
            if (this.playInterval !== null) {
                this.stop()
            }
        }
    }

    speedUp = () => {
        this.changeSpeed('inc')
    }

    speedDown = () => {
        this.changeSpeed('dec')
    }

    changeSpeed = (direction) => {
        this.playSpeed += direction === 'inc' ? -20 : 20
        if (this.playSpeed <= 0) {
            this.playSpeed = 20
        }
        const playDirection = this.playDirection
        clearInterval(this.playInterval)
        this.playInterval = null

        if (playDirection === 'forward') {
            this.play()
        }
        if (playDirection === 'backward') {
            this.rewind()
        }
    }

    toStart = () => {
        this.clearPlay()
        this.setState({
            epoch: 0
        })
    }

    render() {
        let network = null
        if (this.state.networkLoaded) {
            const weights = JSON.parse(fs.readFileSync(`${this.state.epochsDir}/${this.state.epoch}.json`).toString()).slice(1)
            network = <Network
                topology={ this.state.topology }
                weights={ weights }
                // inputs={ inputs }
                // activeLayers={ [ 1 ] }
                // allLayersActive={ true }
            />
        }

        const controls = this.state.networkLoaded && <>
            <br/>
            <button onClick={ this.backward }>prev</button>
            <button onClick={ this.forward }>next</button>
            <button onClick={ this.toStart }>to start</button>
            <br/>
            <button onClick={ this.play }>play</button>
            <button onClick={ this.rewind }>rewind</button>
            <button onClick={ this.stop }>stop</button>
            <button onClick={ this.speedUp }>+</button>
            <button onClick={ this.speedDown }>-</button>
            <br/>
            <h3>Epoch: { this.state.epoch }</h3>
        </>

        return (
            <div className='App' style={ {
                position: 'relative'
            } }>
                <div style={ {
                    position: 'absolute'
                } }>
                    <input placeholder='network dir' style={ { width: '300px' } } value={ this.state.networkFiles }
                        onChange={ this.changeNetworkFiles }/>
                    <button onClick={ this.loadNetwork }>load network</button>
                    { controls }
                </div>
                { network }
            </div>
        )
    }
}

export default App
