import * as THREE from 'three'

export class Player {
    constructor(scene) {
        this.scene = scene
        this.position = new THREE.Vector3(0, 5, 0)
        this.velocity = new THREE.Vector3(0, 0, 0)
        this.direction = new THREE.Vector3(0, 0, 0)
        
        this.speed = 0.15
        this.sprintSpeed = 0.25
        this.baseSpeed = 0.15
        this.isMoving = false
        this.isSprinting = false
        
        this.health = 100
        this.energy = 100
        this.maxHealth = 100
        this.maxEnergy = 100
        
        this.speedBoostActive = false
        this.speedBoostTimer = 0
        
        this.attackCooldown = 0
        this.lastAttackTime = 0
        
        this.createMesh()
    }

    createMesh() {
        // Player body
        const bodyGeometry = new THREE.CapsuleGeometry(1, 2, 4, 8)
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xff6b6b,
            metalness: 0.3,
            roughness: 0.4
        })
        this.body = new THREE.Mesh(bodyGeometry, bodyMaterial)
        this.body.position.copy(this.position)
        this.body.castShadow = true
        this.body.receiveShadow = true
        this.scene.add(this.body)

        // Relic blade
        const bladeGeometry = new THREE.BoxGeometry(0.3, 2, 0.05)
        const bladeMaterial = new THREE.MeshStandardMaterial({
            color: 0x4ade80,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x2a6a20
        })
        this.blade = new THREE.Mesh(bladeGeometry, bladeMaterial)
        this.blade.position.set(0.5, 0, -0.5)
        this.body.add(this.blade)
        this.blade.castShadow = true

        // Speed boost aura
        const auraGeometry = new THREE.SphereGeometry(2, 32, 32)
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0,
            side: THREE.BackSide
        })
        this.aura = new THREE.Mesh(auraGeometry, auraMaterial)
        this.body.add(this.aura)
    }

    move(direction) {
        this.direction = direction.normalize()
        this.isMoving = direction.length() > 0
    }

    sprint(isSprinting) {
        this.isSprinting = isSprinting && this.energy > 0
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount)
        this.updateUI()
    }

    restoreEnergy(amount) {
        this.energy = Math.min(this.maxEnergy, this.energy + amount)
        this.updateUI()
    }

    applySpeedBoost(duration) {
        this.speedBoostActive = true
        this.speedBoostTimer = duration
        this.speed = this.baseSpeed * 1.5
    }

    update(deltaTime) {
        const currentSpeed = this.isSprinting ? this.sprintSpeed : this.speed

        if (this.isMoving) {
            this.position.x += this.direction.x * currentSpeed
            this.position.z += this.direction.z * currentSpeed
        }

        // Simple gravity
        this.position.y = Math.max(1, this.position.y - 0.1)

        // Update mesh
        this.body.position.lerp(this.position, 0.1)

        // Energy regen/drain
        if (this.isSprinting) {
            this.energy = Math.max(0, this.energy - 0.5)
        } else {
            this.energy = Math.min(this.maxEnergy, this.energy + 0.2)
        }

        // Speed boost timer
        if (this.speedBoostActive) {
            this.speedBoostTimer -= deltaTime
            this.aura.material.opacity = 0.3
            
            if (this.speedBoostTimer <= 0) {
                this.speedBoostActive = false
                this.speed = this.baseSpeed
                this.aura.material.opacity = 0
            }
        }

        // Attack cooldown
        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime)

        // Update UI
        this.updateUI()
    }

    updateUI() {
        document.getElementById('health').textContent = Math.floor(this.health)
        document.getElementById('energy').textContent = Math.floor(this.energy)
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount)
    }

    canAttack() {
        return this.attackCooldown <= 0
    }

    performAttack() {
        if (this.canAttack()) {
            this.attackCooldown = 0.3
            return true
        }
        return false
    }

    getPosition() {
        return this.position
    }

    getMesh() {
        return this.body
    }
}
