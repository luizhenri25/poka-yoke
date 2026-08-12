import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RotateCw, ZoomIn, Eye, Sparkles, Rabbit, Target, RefreshCw, Loader2 } from 'lucide-react';

export default function PokaYokeViewer3D({ modelType = 'POSTO3', highlightSensor = true, showRabbit = false }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(false);
  const [isHighlightSensor, setIsHighlightSensor] = useState(highlightSensor);
  const [isShowRabbit, setIsShowRabbit] = useState(showRabbit);

  // Estado de carregamento de arquivos 3D pesados (.glb)
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  // References for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const sensorMeshRef = useRef(null);
  const rabbitMeshRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 400;

    // 1. SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate escuro industrial moderno
    sceneRef.current = scene;

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(4, 3, 5);
    cameraRef.current = camera;

    // 3. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    currentMount.appendChild(renderer.domElement);

    // 4. CONTROLS (OrbitControls)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // 5. LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 2, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x334155, 0x1e293b);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // 6. BUILD 3D MODELS ACCORDING TO MODEL TYPE
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Material metálico industrial
    const metalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x64748b, 
      metalness: 0.8, 
      roughness: 0.3 
    });

    const highlightMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3b82f6, 
      emissive: 0x2563eb,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.2
    });

    const rabbitMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xef4444, 
      emissive: 0xdc2626,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.2
    });

    if (modelType === 'BANCOS_P13C') {
      // APENAS O ARQUIVO ORIGINAL 3D DO USUÁRIO (BANCOS_P13C.glb) SEM DESENHOS ADICIONAIS
      setIsLoadingModel(true);

      const loader = new GLTFLoader();
      loader.load(
        '/BANCOS_P13C.glb',
        (gltf) => {
          const model = gltf.scene;
          
          // Corrigir orientação do arquivo CAD Siemens (Z-Up para Y-Up em WebGL para o banco ficar reto em pé)
          model.rotation.x = -Math.PI / 2;
          model.updateMatrixWorld(true);

          // Recalcular a caixa delimitadora com o modelo de pé
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDimension = Math.max(size.x, size.y, size.z);
          const targetScale = 3.6 / (maxDimension || 1);
          
          model.scale.set(targetScale, targetScale, targetScale);
          
          // Centralizar perfeitamente no piso industrial
          model.position.x = -center.x * targetScale;
          model.position.y = -box.min.y * targetScale - 0.9;
          model.position.z = -center.z * targetScale;

          // Habilitar renderização de materiais originais
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                child.material.side = THREE.DoubleSide;
              }
            }
          });

          mainGroup.add(model);
          setIsLoadingModel(false);
        },
        (xhr) => {
          if (xhr.lengthComputable && xhr.total > 0) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            setLoadProgress(percent);
          }
        },
        (error) => {
          console.error("Erro ao carregar o arquivo 3D BANCOS_P13C.glb:", error);
          setIsLoadingModel(false);
        }
      );

    } else if (modelType === 'POSTO3') {
      // ESTRUTURA DE BANCO BDIA + SENSOR POKA YOKE DE INVERSÃO
      // Base metálica
      const baseGeo = new THREE.BoxGeometry(2.5, 0.2, 2);
      const baseMesh = new THREE.Mesh(baseGeo, metalMaterial);
      baseMesh.position.y = -0.9;
      mainGroup.add(baseMesh);

      // Trilhos do banco
      const railGeo = new THREE.BoxGeometry(0.15, 0.15, 2.2);
      const rail1 = new THREE.Mesh(railGeo, metalMaterial);
      rail1.position.set(-0.9, -0.75, 0);
      mainGroup.add(rail1);

      const rail2 = rail1.clone();
      rail2.position.set(0.9, -0.75, 0);
      mainGroup.add(rail2);

      // Estrutura do Encosto (Tubular)
      const frameGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2);
      const pillar1 = new THREE.Mesh(frameGeo, metalMaterial);
      pillar1.position.set(-0.8, 0.3, -0.7);
      mainGroup.add(pillar1);

      const pillar2 = pillar1.clone();
      pillar2.position.set(0.8, 0.3, -0.7);
      mainGroup.add(pillar2);

      const topBarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.7);
      const topBar = new THREE.Mesh(topBarGeo, metalMaterial);
      topBar.rotation.z = Math.PI / 2;
      topBar.position.set(0, 1.35, -0.7);
      mainGroup.add(topBar);

      // Placa de Assento
      const seatGeo = new THREE.BoxGeometry(1.6, 0.1, 1.4);
      const seatMesh = new THREE.Mesh(seatGeo, metalMaterial);
      seatMesh.position.set(0, -0.3, 0.1);
      mainGroup.add(seatMesh);

      // SENSOR POKA-YOKE (Ótico com Feixe Laser Azul)
      const sensorGeo = new THREE.BoxGeometry(0.3, 0.3, 0.5);
      const sensorMesh = new THREE.Mesh(sensorGeo, highlightMaterial);
      sensorMesh.position.set(0.85, 0.4, -0.7);
      mainGroup.add(sensorMesh);
      sensorMeshRef.current = sensorMesh;

      // Laser Beam emissor
      const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.6);
      const laserMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.rotation.z = Math.PI / 2;
      laser.position.set(0, 0.4, -0.7);
      mainGroup.add(laser);

      // PEÇA COELHO (Red Rabbit - Marcada em Vermelho)
      const rabbitGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
      const rabbitMesh = new THREE.Mesh(rabbitGeo, rabbitMaterial);
      rabbitMesh.position.set(-0.85, 0.4, -0.7);
      mainGroup.add(rabbitMesh);
      rabbitMeshRef.current = rabbitMesh;

    } else if (modelType === 'POSTO10') {
      // PARAFUSADEIRA ELÉTRICA & FECHO DE CINTO (POSTO 10)
      // Corpo da Parafusadeira
      const bodyGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5);
      const bodyMesh = new THREE.Mesh(bodyGeo, metalMaterial);
      bodyMesh.rotation.x = Math.PI / 2;
      bodyMesh.position.set(0, 0.5, 0);
      mainGroup.add(bodyMesh);

      // Soquete da Parafusadeira
      const bitGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
      const bitMesh = new THREE.Mesh(bitGeo, metalMaterial);
      bitMesh.rotation.x = Math.PI / 2;
      bitMesh.position.set(0, 0.5, 1);
      mainGroup.add(bitMesh);

      // Fecho de Cinto
      const buckleGeo = new THREE.BoxGeometry(0.5, 0.9, 0.2);
      const buckleMesh = new THREE.Mesh(buckleGeo, isShowRabbit ? rabbitMaterial : metalMaterial);
      buckleMesh.position.set(0, 0.5, 1.6);
      mainGroup.add(buckleMesh);
      rabbitMeshRef.current = buckleMesh;

      // Sensor Indutivo de Torque
      const sensorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.4);
      const sensorMesh = new THREE.Mesh(sensorGeo, highlightMaterial);
      sensorMesh.position.set(0.35, 0.5, 1);
      mainGroup.add(sensorMesh);
      sensorMeshRef.current = sensorMesh;

    } else {
      // DFE015 - ENROLADOR DE CINTO & LEITOR QR CODE
      const baseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.6, 16);
      const baseMesh = new THREE.Mesh(baseGeo, metalMaterial);
      mainGroup.add(baseMesh);

      // Leitor QR Code Ótico
      const scannerGeo = new THREE.BoxGeometry(0.4, 0.4, 0.6);
      const scannerMesh = new THREE.Mesh(scannerGeo, highlightMaterial);
      scannerMesh.position.set(0, 0.8, 0);
      mainGroup.add(scannerMesh);
      sensorMeshRef.current = scannerMesh;

      // Peça Mestre (Red Rabbit)
      const rabbitGeo = new THREE.BoxGeometry(0.6, 0.2, 0.6);
      const rabbitMesh = new THREE.Mesh(rabbitGeo, rabbitMaterial);
      rabbitMesh.position.set(0, -0.4, 0);
      mainGroup.add(rabbitMesh);
      rabbitMeshRef.current = rabbitMesh;
    }

    // 7. ANIMATION LOOP
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      // Pulsar emissão do sensor néon
      if (sensorMeshRef.current && isHighlightSensor) {
        const pulse = (Math.sin(elapsedTime * 4) + 1) / 2; // 0 to 1
        sensorMeshRef.current.material.emissiveIntensity = 0.3 + pulse * 0.7;
      }

      // Rotação Automática
      if (controlsRef.current) {
        controlsRef.current.autoRotate = autoRotate;
        controlsRef.current.autoRotateSpeed = 2.0;
        controlsRef.current.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. RESIZE HANDLER
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelType, autoRotate, isHighlightSensor, isShowRabbit]);

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4, 3, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const focusOnSensor = () => {
    if (cameraRef.current && controlsRef.current && sensorMeshRef.current) {
      const pos = sensorMeshRef.current.position;
      cameraRef.current.position.set(pos.x + 1.5, pos.y + 1, pos.z + 2);
      controlsRef.current.target.set(pos.x, pos.y, pos.z);
      controlsRef.current.update();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid #334155' }}>
      
      {/* Overlay de Carregamento de Arquivos CAD 3D (.glb) */}
      {isLoadingModel && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          backdropFilter: 'blur(4px)',
          color: 'white'
        }}>
          <Loader2 size={36} color="#60A5FA" className="animate-spin" style={{ marginBottom: '0.75rem' }} />
          <strong style={{ fontSize: '1rem', color: '#F8FAFC' }}>Carregando Modelo 3D Nativo (BANCOS_P13C.glb)...</strong>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.25rem' }}>
            Processando malhas e geometrias CAD {loadProgress > 0 ? `(${loadProgress}%)` : ''}
          </span>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Overlays de Controle do Operador / Engenheiro */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
        zIndex: 10
      }}>
        <button 
          onClick={() => setIsHighlightSensor(!isHighlightSensor)}
          style={{
            backgroundColor: isHighlightSensor ? '#3B82F6' : 'rgba(30, 41, 59, 0.8)',
            color: 'white',
            border: '1px solid #60A5FA',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Sparkles size={14} color="#60A5FA" /> Sensor Néon {isHighlightSensor ? 'ON' : 'OFF'}
        </button>

        <button 
          onClick={() => setIsShowRabbit(!isShowRabbit)}
          style={{
            backgroundColor: isShowRabbit ? '#EF4444' : 'rgba(30, 41, 59, 0.8)',
            color: 'white',
            border: '1px solid #FCA5A5',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Rabbit size={14} color="#FCA5A5" /> Peça Coelho {isShowRabbit ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 10
      }}>
        <button 
          onClick={focusOnSensor}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            border: '1px solid #475569',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <Target size={14} color="#3B82F6" /> Zoom no Sensor
        </button>

        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          style={{
            backgroundColor: autoRotate ? '#10B981' : 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            border: '1px solid #475569',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <RotateCw size={14} className={autoRotate ? 'animate-spin' : ''} /> 360° Giração {autoRotate ? 'ON' : 'OFF'}
        </button>

        <button 
          onClick={resetCamera}
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            color: 'white',
            border: '1px solid #475569',
            padding: '0.4rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Reset Visão
        </button>
      </div>

      {/* Dica de Utilização Touch */}
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        color: '#CBD5E1',
        padding: '0.3rem 0.6rem',
        borderRadius: '4px',
        fontSize: '0.7rem',
        fontWeight: 600,
        zIndex: 5
      }}>
        🖐️ Arraste para girar em 360° | Scroll/Pinch para zoom
      </div>

    </div>
  );
}
