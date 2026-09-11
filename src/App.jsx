import './App.css'
import {Canvas, useLoader} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Perf } from 'r3f-perf'
import Player from "./Player.jsx";
import {KeyboardControls, OrbitControls, OrthographicCamera, Sky, useGLTF} from "@react-three/drei";
import Location_1 from "./scene/Location_1.jsx";
import * as THREE from "three";
import useGameStore from "./store.js";


function App() {
    const {nodes, materials, animations} = useGLTF("./scene/scene.glb")
    const loadedScene = useLoader(THREE.ObjectLoader, './json/Scene.json');
    const level = useGameStore((state)=>state.level)
  return (
    <>

      <Canvas  shadows camera={{fov: 60, near: 0.1, far: 200}}>
          <fog  attach="fog" args={['white', 100, 190]} />
          <Sky sunPosition={[100, 20, 100]} distance={100000}/>
          <ambientLight intensity={0.3 * Math.PI} />
          <pointLight
              castShadow
              intensity={0.8 * Math.PI}
              decay={0}
              position={[100, 100, 100]}
          />
          <KeyboardControls
              map={[
                  { name: "forward", keys: ["ArrowUp", "w", "W"] },
                  { name: "backward", keys: ["ArrowDown", "s", "S"] },
                  { name: "left", keys: ["ArrowLeft", "a", "A"] },
                  { name: "right", keys: ["ArrowRight", "d", "D"] },
                  { name: "jump", keys: ["Space"] },
              ]}
          >
          <Physics key={level} gravity={[0,-50,0]} debug={false}>
              <Player />
              <Location_1 nodes={nodes} loadedScene={loadedScene}   />
          </Physics>
          </KeyboardControls>
          <OrthographicCamera  />
         {/* <OrbitControls/>*/}
          <Perf  style={{
              position:"fixed",
              left:0,
              right:0,
              bottom:"-90%",
              margin:"auto",
              width:"400px",
              height:"100px",
          }} />
      </Canvas>

    </>
  )
}

export default App
