import * as THREE from 'three'

export class ParticleSystem {
    constructor(scene) {
        this.scene = scene
        this.particles = []
    }

    createExplosion(position, color = 0xff6b6b) {
        const count = 20
        const geometry = new THREE.BufferGeometry()
        const positions = []
        const velocities = []

        for (let i = 0; i < count; i++) {
            positions.push(position.x, position.y, position.z)
            
            const angle = (Math.random() * Math.PI * 2)
            const speed = Math.random() * 0.3 + 0.1
            velocities.push(
                Math.cos(angle) * speed,
                Math.random() * 0.3 + 0.1,
                Math.sin(angle) * speed
            )
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.3,
            sizeAttenuation: true
        })

        const points = new THREE.Points(geometry, material)
        this.scene.add(points)

        const particle = {
            mesh: points,
            velocities: velocities,
            life: 1.0,
            maxLife: 1.0
        }
        this.particles.push(particle)
    }

    createCollectEffect(position) {
        const count = 15
        const geometry = new THREE.BufferGeometry()
        const positions = []

        for (let i = 0; i < count; i++) {
            positions.push(position.x, position.y, position.z)
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))

        const material = new THREE.PointsMaterial({
            color: 0xff00ff,
            size: 0.2,
            sizeAttenuation: true
        })

        const points = new THREE.Points(geometry, material)
        this.scene.add(points)

        const particle = {
            mesh: points,
            life: 1.0,
            maxLife: 1.0,
            isCollect: true
        }
        this.particles.push(particle)
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i]
            particle.life -= deltaTime

            if (particle.life <= 0) {
                this.scene.remove(particle.mesh)
                this.particles.splice(i, 1)
                continue
            }

            const alpha = particle.life / particle.maxLife
            particle.mesh.material.opacity = alpha

            if (!particle.isCollect && particle.velocities) {
                const positions = particle.mesh.geometry.attributes.position.array
                for (let j = 0; j < positions.length; j += 3) {
                    positions[j] += particle.velocities[j] * deltaTime
                    positions[j + 1] += particle.velocities[j + 1] * deltaTime
                    positions[j + 2] += particle.velocities[j + 2] * deltaTime
                }
                particle.mesh.geometry.attributes.position.needsUpdate = true
            }
        }
    }
}