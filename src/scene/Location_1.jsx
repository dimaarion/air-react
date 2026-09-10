import {
    BoxTexture,
    BoxTextureInstances,
    Ground,
    InstancesObjects,
    InstancesRigObjects,
    VisibleObjectToDistance
} from "../Objects.jsx";
import level_1 from "../assets/json/level_1.json"
import {useMemo} from "react";
import {BallCollider, ConeCollider, CuboidCollider, CylinderCollider, RigidBody} from "@react-three/rapier";
import {Billboard} from "@react-three/drei";
export default function Location_1({nodes,materials,animations}){
    const ground = useMemo(()=>{
        return level_1.filter((el)=>el.name === "ground")
    },[])
    const startPlatform = useMemo(()=>{
        return level_1.filter((el)=>el.name === "platform-pusck")
    },[])

    const christmas = useMemo(()=>{
        return level_1.filter((el)=>el.name === "christmas").map((el)=>{
            el.args = [el.scale[0],el.scale[0] / 2]
            return el
        })
    },[])

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
        {ground.map((el)=><Ground key={el.id + "Ground_t"} rotation={el.rotation} scale={el.scale} position={el.position}/>)}
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
        <InstancesObjects name={"christmas"} arr={christmas}>
            <BoxTextureInstances name={"christmas"} scale={[1,1]} />
        </InstancesObjects>
        <InstancesObjects name={"mountain"} arr={mountain}>
            <BoxTextureInstances name={"mountain"} scale={[1,1]} />
        </InstancesObjects>
        <RigidBody type={"fixed"}>
            {christmas.map((el)=><ConeCollider key={el.id + "christmas_t"} position={el.position} args={el.args}/>)}
        </RigidBody>
        <RigidBody type={"fixed"}>
            {walls.map((el)=><CuboidCollider key={el.id + "walls_t"} position={el.position} args={el.scale}/>)}
        </RigidBody>
    </group>
}