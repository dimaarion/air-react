import {CuboidCollider, CylinderCollider, InstancedRigidBodies, RigidBody} from "@react-three/rapier";
import {useFrame} from "@react-three/fiber";
import {useMemo, useRef} from "react";
import {Billboard, Instance, Instances, useTexture} from "@react-three/drei";
import * as THREE from "three";


export function Platform({position=[0,0,0]}){

    return<RigidBody colliders={"cuboid"} type={"fixed"} position={position}>
        <mesh>
            <boxGeometry args={[1000,1,1]} />
            <meshBasicMaterial color={"#B35A3A"}/>
        </mesh>
    </RigidBody>
}

export function Ground({position=[0,0,0],scale=[1,1],rotation=[0,0,0]}){
    const texture = useTexture("./img/ground.png");
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return<RigidBody colliders={"cuboid"} type={"fixed"} rotation={rotation} position={[position[0] + scale[0] / 2,position[1] + scale[1] / 2,position[2] - scale[2] / 2 ]}>
        <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
            <planeGeometry args={[1000,1000]} />
            <meshStandardMaterial
                map={texture}
                map-repeat={[129, 129]}
                color="white"
            />
        </mesh>
    </RigidBody>
}

export function VisibleObjectToDistance({children, position = [0, 0, 0], dist = 250}){
     function getDistance(playerPos,objectPos,threshold = 100){
        const dist = Math.sqrt(
            Math.pow(playerPos.x - objectPos.x, 2) + Math.pow(playerPos.z - objectPos.z, 2) // Можно считать только в 2D (X и Z)
        );
        return dist < threshold;
    }
    const groupRef = useRef(null)
    useFrame(({camera})=>{
        if (!groupRef.current) return
        groupRef.current.visible = getDistance(camera.position, {x: position[0], z: position[2]}, dist)
    })
    return <group ref={groupRef}>{children}</group>
}

export function BoxTexture({name,position,rotation,scale,repeat = [1,1]}){

    const props = useTexture({
        map: "./img/" + name + ".png",
    })
    return <mesh  position={position} rotation={rotation}>
            <boxGeometry args={scale}  />
            <meshStandardMaterial {...props} transparent={true} alphaTest={0.5} map-repeat={repeat}   />
        </mesh>

}

export function BoxTextureInstances({name,scale}){

    const props = useTexture({
        map: "./img/" + name + ".png",
    })
    return <>
        <boxGeometry args={scale}  />
        <meshStandardMaterial {...props} transparent={true} alphaTest={0.5}    />
    </>

}

export function PlaneTexture({name,position,rotation,scale=[1,1],repeat = [1,1]}){

    const props = useTexture({
        map: "./img/" + name + ".png",
    })
    return <Billboard follow={true} lockX={true} lockY={true} lockZ={true}> <mesh  position={position} rotation={rotation}>
        <planeGeometry args={scale}  />
        <meshStandardMaterial {...props} transparent={true} alphaTest={0.5} map-repeat={repeat}   />
    </mesh></Billboard>

}

export function PlaneTextureInstance({name,scale=[1,1],repeat = [1,1]}){

    const props = useTexture({
        map: "./img/" + name + ".png",
    })
    return <Billboard follow={true} lockX={true} lockY={true} lockZ={true}>
        <planeGeometry args={scale}  />
        <meshStandardMaterial {...props} transparent={true} alphaTest={0.5} map-repeat={repeat}   />
    </Billboard>

}

export function RigPlatform({ arr }) {
    const bodyRef = useRef()
    const colliders = useMemo(() => {
        return arr.map((el) => (
            <CuboidCollider
                key={el.id}
                position={el.position}
                rotation={el.rotation}
                args={el.scale}
            />
        ));
    }, [arr]);



    return (
        <RigidBody ref={bodyRef} type="fixed" colliders={false}>
            {colliders}
        </RigidBody>
    );
}

export function InstancesObjects({arr, geometry, materials, children = null, ref = null, name = "instance"}) {



    return <group>
        <Instances
            name={name}
            ref={ref}
            limit={arr.length} // Optional: max amount of items (for calculating buffer size)
            range={arr.length} // Optional: draw-range
            geometry={geometry}
            material={materials}
        >

            {children?children:""}
            {arr.map((el) => {
                return <Instance
                    key={`${el.id}-${el.position[0]}-${el.position[1]}`}
                    position={el.position}
                    rotation={el.rotation}
                    scale={el.scale}


                />
            })}
        </Instances>
    </group>
}


export  function InstancesRigObjects({arr,onIntersectionEnter = ()=>{},geometry = null,materials, type = "fixed",name="", colliders = "cuboid", sensor = false, children}){
    const objRef = useRef(null);
    const instances = useMemo(()=>{
        return  arr.map((el)=>{
            return {
                key:el.id,
                position:el.position,
                rotation:el.rotation,
                scale:el.scale,
                userData: {name: name}

            }
        })
    },[arr,name])

    return <InstancedRigidBodies
        instances={instances}
        sensor={sensor}
        colliders={colliders}
        onIntersectionEnter={onIntersectionEnter}
        type={type} >
        colliderNodes={[


    ]}
        {geometry?<instancedMesh ref={objRef} args={[geometry, materials, arr?.length]}/>:
            <instancedMesh ref={objRef} args={[null, null, arr?.length]}>
                {children}
            </instancedMesh>}
    </InstancedRigidBodies>
}
