import {Billboard, Box, SpriteAnimator, useKeyboardControls} from "@react-three/drei";
import {BallCollider, CuboidCollider, RigidBody, useRopeJoint} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useEffect, useRef} from "react";
import {Vector3} from "three";
import {PlaneTexture} from "./Objects.jsx";




export default function Player(){
    const [, get] = useKeyboardControls();
const config = {
    t:0.1,
    v:1.5,
    l:7,
    burner:{
        position:{
            x:0,
            y:-5
        },
        speed:{
            scale:0.5,
            value:0,
            step:0.1
        }
    }
}
const ref = useRef()
const basket = useRef()
const basketTexture = useRef()
const ballon = useRef()
const player = useRef()
const burner = useRef()

    const vec = new Vector3()
useFrame(({camera})=>{
    if(!ref.current)return
    

    const position = ref.current.translation()
    camera.position.lerp(vec.set(position.x,position.y + 1,position.z + 40),1)
    camera.lookAt(position.x,position.y - 5,position.z)
    ballon.current.position.x = position.x
    ballon.current.position.y = position.y
    ballon.current.position.z = position.z + config.v
    ballon.current.rotation.z = ref.current.rotation().z
    ballon.current.rotation.x = 0
    ballon.current.rotation.y = 0



    const posBasket = basket.current.translation()
    basketTexture.current.position.x = posBasket.x
    basketTexture.current.position.y = posBasket.y
    basketTexture.current.position.z = posBasket.z + config.v
    basketTexture.current.rotation.z = basket.current.rotation().z * 2
    basketTexture.current.rotation.x = 0
    basketTexture.current.rotation.y = 0

    let y = 0.5
    let x = 0
    burner.current.scale.x = config.burner.speed.scale
    burner.current.scale.y = config.burner.speed.scale
    burner.current.position.y = burner.current.scale.y /0.3
    const { forward, backward, left, right, jump } = get();
    if(forward){
        if(ballon.current.position.y < 40){
            y = 10
            config.burner.speed.value += config.burner.speed.step
        }
    }


    if(backward){
        y = -10
        config.burner.speed.value -= config.burner.speed.step
    }
    if(right){
        //x = 10
    }
    burner.current.scale.y = config.burner.speed.value
    burner.current.scale.x = config.burner.speed.value
    if(burner.current.scale.y >= 2){
        burner.current.scale.y = 2
        burner.current.scale.x = 2
    }
    if(burner.current.scale.y <= 0.5){
        burner.current.scale.y = 0.5
        burner.current.scale.x = 0.5
    }
    if(ballon.current.position.y > 15){
        x = 10
    }
    if(ballon.current.position.y > 20){
        x = 20
    }
    if(ballon.current.position.y > 30){
        x = 25
    }

    ref.current?.setLinvel({ x: x, y: y, z: 0 },true)
})

    useEffect(() => {

    }, [get]);

    useRopeJoint(ref, basket, [
        [-0.5, -6, -0.5],
        [-config.v, config.v, -config.v],
        config.l
    ]);
    useRopeJoint(ref, basket, [
        [-0.5, -6, 0.5],
        [-config.v, config.v, config.v],
        config.l
    ]);
    useRopeJoint(ref, basket, [
        [0.5, -6, -0.5],
        [config.v, config.v, -config.v],
        config.l
    ]);
    useRopeJoint(ref, basket, [
        [0.5, -6, 0.5],
        [config.v, config.v, config.v],
        config.l
    ]);


    return<group >
        <group ref={ballon}>
                <PlaneTexture name={"ballon_0"} position={[0,0,0]} scale={[4,7]} rotation={[0,0,0]}/>
            <group position={[0,config.burner.position.y,0]}>
                <PlaneTexture name={"burner_0"}  scale={[1.5,1.5]} rotation={[0,0,0]}/>
                <SpriteAnimator ref={burner} fps={8}
                                position={[0, 1.5, 0]}
                                startFrame={0}
                                autoPlay={true}
                                loop={true}
                                scale={2}
                                textureImageURL={'./img/fire.png'}
                                textureDataURL={'./json/frame.json'}
                                alphaTest={0.01}
                                asSprite={true}
                />

            </group>
        </group>
        <group ref={basketTexture}>
            <PlaneTexture name={"bascet_0"} position={[0,0,0]} scale={[5,4]} rotation={[0,0,0]}/>
        </group>


        <RigidBody ref={ref} position={[0,15,0]} enabledRotations={[false, false, false]}  type={"dynamic"}>
           <BallCollider args={[2]} />
        </RigidBody>
        <RigidBody enabledRotations={[false, false, true]} ref={basket} position={[0,5,0]} type={"dynamic"} colliders={"cuboid"}>
            <CuboidCollider position={[0,-config.v,0]} args={[config.v,config.t,config.v]} />
            <CuboidCollider position={[-config.v,0,0]} args={[config.t,config.v,config.v]} />
            <CuboidCollider position={[config.v,0,0]} args={[config.t,config.v,config.v]} />
            <CuboidCollider position={[0,0,config.v]} args={[config.v,config.v,config.t]} />
            <CuboidCollider position={[0,0,-config.v]} args={[config.v,config.v,config.t]} />
        </RigidBody>
        <RigidBody ref={player} position={[0,5,0]} type={"dynamic"} colliders={"cuboid"}>
            <group>
                <PlaneTexture name={"player"} position={[0,0,0]} scale={[2,4]} rotation={[0,0,0]}/>
            </group>
            <CuboidCollider position={[0,0,0]} args={[1,2,1]} />
        </RigidBody>




    </group>


}