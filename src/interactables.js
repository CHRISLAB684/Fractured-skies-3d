import * as THREE from 'three'

export class Shard {
    constructor(position, id) {
        this.position = position
        this.id = id
        this.isCollected = false
        this.createMesh()
    }

    createMesh() {
        const geometry = new THREE.OctahedronGeometry(1, 0)
        const material = new THREE.MeshStandardMaterial({
            color: 0xff00ff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x8800ff
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.copy(this.position)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        // Add glow
        const glowGeometry = new THREE.OctahedronGeometry(1.3, 0)
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0xff00ff,
            transparent: true,
            opacity: 0.3
        })
        const glow = new THREE.Mesh(glowGeometry, glowMaterial)
        this.mesh.add(glow)
    }

    collect() {
        this.isCollected = true
        this.mesh.visible = false
    }

    getPosition() {
        return this.position
    }

    getMesh() {
        return this.mesh
    }
}

export class Tower {
    constructor(position) {
        this.position = position
        this.isActivated = false
        this.createMesh()
    }

    createMesh() {
        const group = new THREE.Group()
        group.position.copy(this.position)

        // Tower base
        const baseGeometry = new THREE.CylinderGeometry(4, 5, 15, 32)
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x4a90e2,
            metalness: 0.5,
            roughness: 0.5
        })
        const base = new THREE.Mesh(baseGeometry, baseMaterial)
        base.castShadow = true
        base.receiveShadow = true
        group.add(base)

        // Tower tip
        const tipGeometry = new THREE.ConeGeometry(3, 8, 32)
        const tipMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            metalness: 0.8,
            roughness: 0.2
        })
        const tip = new THREE.Mesh(tipGeometry, tipMaterial)
        tip.position.y = 12
        tip.castShadow = true
        group.add(tip)

        // Crystal core
        const coreGeometry = new THREE.SphereGeometry(1.5, 32, 32)
        const coreMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x0088ff
        })
        const core = new THREE.Mesh(coreGeometry, coreMaterial)
        core.position.y = 0
        core.castShadow = true
        group.add(core)

        this.mesh = group
    }

    activate() {
        this.isActivated = true
    }

    getPosition() {
        return this.position
    }

    getMesh() {
        return this.mesh
    }
}

export class BridgeGap {
    constructor(position, id) {
        this.position = position
        this.id = id
        this.isRepaired = false
        this.createMesh()
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(2, 0.5, 2)
        const material = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0xff6600
        })
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.position.copy(this.position)
        this.mesh.castShadow = true
        this.mesh.receiveShadow = true

        // Repair indicator
        const indicatorGeometry = new THREE.RingGeometry(1.2, 1.5, 32)
        const indicatorMaterial = new THREE.MeshBasicMaterial({
            color: 0xffa500,
            side: THREE.DoubleSide
        })
        const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial)
        indicator.position.y = 1
        this.mesh.add(indicator)
    }

    repair() {
        this.isRepaired = true
        this.mesh.material.color.setHex(0x00aa00)
        this.mesh.material.emissive.setHex(0x00ff00)
    }

    getPosition() {
        return this.position
    }

    getMesh() {
        return this.mesh
    }
}
