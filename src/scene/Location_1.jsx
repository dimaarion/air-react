import {
    BoxTextureInstances,
    InstancesObjects,
    VisibleObjectToDistance
} from "../Objects.jsx";
import level_1 from "../assets/json/level_1.json"
import { useMemo} from "react";
import { ConeCollider, CuboidCollider, CylinderCollider, RigidBody} from "@react-three/rapier";
import useGameStore from "../store.js";


export default function Location_1({nodes,loadedScene}){


    console.log(loadedScene)

    const ground = useMemo(()=>{
        return loadedScene.children.filter((el)=>el.name === "ground").map((el)=>{
            let p = el?.geometry.parameters
            return {
                id: el.id,
                position:[el.position.x,el.position.y,el.position.z],
                args:[p.width / 2,p.height / 2,p.depth / 2]
            }
        })
    },[loadedScene.children])

    const startPlatform = useMemo(()=>{
        return level_1.filter((el)=>el.name === "platform-pusck")
    },[])

    const christmas = useMemo(()=>{
        return loadedScene.children.filter((el)=>el.name === "christmas").map((el)=>{
            let p = el?.geometry.parameters
            return {
                id: el.id,
                position:[el.position.x,el.position.y,el.position.z],
                args:[p.height / 2,p.width / 2]
            }
        })
    },[loadedScene.children])

    const walls = useMemo(()=>{
        return level_1.filter((el)=>el.name === "walls")
    },[])

    const mountain = useMemo(()=>{
        let a = []
        for (let i = 0; i < 20; i++){
            a[i] = {
                position:[(i * 100) - 500,0,-50],
                scale:[250, 100, 0.01],
                rotation:[0,0,0]
            }
        }

        return a
    },[])


    return <group>
        <primitive object={loadedScene}/>

        {startPlatform.map((el)=><VisibleObjectToDistance key={el.id + "ground"} dist={300} position={el.position}>
            <group position={el.position}>
                <RigidBody colliders={"cuboid"} type={"fixed"}  >
                    <CylinderCollider args={[0.5,10]} />
                </RigidBody>
                <primitive object={nodes["platform-pusck"]} />
            </group>
        </VisibleObjectToDistance>)}
        {startPlatform.map((el)=><VisibleObjectToDistance key={el.id + "christmas"} dist={300} position={el.position}>

        </VisibleObjectToDistance>)}

        <InstancesObjects name={"mountain"} arr={mountain}>
            <BoxTextureInstances name={"mountain"} scale={[1,1]} />
        </InstancesObjects>
        <RigidBody type={"fixed"}>
            {christmas.map((el)=><ConeCollider key={el.id + "christmas"}  position={el.position} args={el.args}/>)}
        </RigidBody>
        <RigidBody type={"fixed"}>
            {walls.map((el)=><CuboidCollider key={el.id + "walls_t"} position={el.position} args={el.scale}/>)}
        </RigidBody>
        <RigidBody onCollisionEnter={(e)=>{
            if(e.other.colliderObject.name === "player") {
               useGameStore.getState().restartLevel()
            }

        }} type={"fixed"}>
            {ground.map((el)=><CuboidCollider name={"ground"} key={el.id + "ground"} position={el.position} args={el.args}/>)}
        </RigidBody>
    </group>
}