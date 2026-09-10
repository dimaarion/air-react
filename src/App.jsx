import './App.css'
import {Canvas} from "@react-three/fiber";
import {Physics} from "@react-three/rapier";
import { Perf } from 'r3f-perf'
import Player from "./Player.jsx";
import {KeyboardControls, OrbitControls, OrthographicCamera, Sky, useGLTF} from "@react-three/drei";
import Location_1 from "./scene/Location_1.jsx";


function App() {
    const {nodes, materials, animations} = useGLTF("./scene/scene.glb")

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
          <Physics gravity={[0,-50,0]} debug={true}>
              <Player />
              <Location_1 nodes={nodes} materials={materials} animations={animations} />
          </Physics>
          </KeyboardControls>
          <OrthographicCamera  />
         {/* <OrbitControls/>*/}
          <Perf  position="top-left" />
      </Canvas>

    </>
  )
}

export default App
