import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {useGLTF, useTexture} from "@react-three/drei";
const texture = [
    "stone.png",
    "ballon_0.png",
    "bascet_0.png",
    "player.png",
    "burner_0.png"
]
    .map((el)=>"./img/" + el)

useGLTF.preload([
    './scene/scene.glb',
]);
useTexture.preload(texture)
createRoot(document.getElementById('root')).render(<App />)
