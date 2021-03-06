import React from 'react';
import { AR } from 'expo';
import { GraphicsView } from 'expo-graphics';
import ExpoTHREE, { THREE, AR as ThreeAR } from 'expo-three';

const screenCenter = new THREE.Vector2(0.5, 0.5);

export default class App extends React.Component {
  componentWillMount() {
    THREE.suppressExpoWarnings();
  }

  // Cuando el contexto es creado, se puede empezar a crear cosas en 3D.
  onContextCreate = ({ gl, width, height, scale }) => {
    // Esto permite a AR detectar superfices horizontales.
    AR.setPlaneDetection(AR.PlaneDetection.Horizontal);

    // Crea un 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      width,
      height,
      pixelRatio: scale,
    });

    // Nuestra escena.
    this.scene = new THREE.Scene();

    // Crear una textura y la utiliza como fondo en nuestra escena.
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);

    // Crear una cámara que coincida con la orientación del dispositivo.
    this.camera = new ThreeAR.Camera(width, height, 0.1, 1000);

    // Hacemos un cubo. Cada unidad equivale a 1 metro en la vida real.
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);

    // Color del material
    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    // Combinamos la geometria con el material.
    this.cube = new THREE.Mesh(geometry, material);

    // Ubicamos el cubo a 0.4 metros de distancia de nosotros.
    this.cube.position.z = -0.4

    /* this.magnetic = new ThreeAR.MagneticObject();
    this.magnetic.add(this.cube);
    this.scene.add(this.magnetic); */

    // Añadimos el cubo a la escena.
    this.scene.add(this.cube);

    // Configura el color de la luz para que podamos ver el color del cubo.
    this.scene.add(new THREE.AmbientLight(0x404040));
    this.scene.add(new THREE.DirectionalLight(0xffffff, 0.6));
  };

  onRender = () => {
    // Finalmente renderiza la escena con la Camara AR.
    /* this.magnetic.update(this.camera, screenCenter); */
    this.renderer.render(this.scene, this.camera);
  };

  // Cuando el telefono rota, o la vista cambia de tamaño, este método será llamado.
  onResize = ({ x, y, scale, width, height }) => {
    // Detiene la función si la escena aun no se ha configurado.
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  render() {
    // Las propiedades `isArEnabled` & `arTrackingConfiguration` son requeridas.
    // `isArRunningStateEnabled` mostrara un botón de play/pause en la ezquina de la pantalla.
    // `isArCameraStateEnabled` mostrará información de la cámara en la pantalla.
    // `arTrackingConfiguration` indica que cámara utilizará la sesión de AR. 
    return (
      <GraphicsView
        style={{ flex: 1 }}
        isArEnabled
        onContextCreate={this.onContextCreate}
        onRender={this.onRender}
        onResize={this.onResize}
        arTrackingConfiguration={AR.TrackingConfiguration.World}
        isArRunningStateEnabled={true}
        isArCameraStateEnabled={true}
      />
    );
  }
};
