import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const Light = () => {
  useEffect(() => {
    //****************  创建场景、相机、渲染器  ***************** */
    // 创建场景
    const scene = new THREE.Scene();
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      450, //视角
      window.innerWidth / window.innerHeight, //宽高比
      0.1, //近平面
      1000 //远平面
    );
    // 设置相机位置
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    //****************  创建父子几何体  ***************** */
    // 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 创建材质
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // 创建网格
    const cube = new THREE.Mesh(geometry, material);
    // 将网格添加到场景中
    scene.add(cube);
    // 创建子几何体
    const geometry2 = new THREE.BoxGeometry(1, 1, 1);
    const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const cube2 = new THREE.Mesh(geometry2, material2);
    cube.add(cube2);

    cube2.position.x = 2;
    cube.position.y = 2;
    //****************  添加世界坐标辅助器  ***************** */
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    //****************  轨道控制器  ***************** */
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    // 设置带阻尼的惯性
    controls.enableDamping = true;
    // 设置阻尼系数
    controls.dampingFactor = 0.05;
    //****************  渲染函数  ***************** */
    // 渲染函数
    let count = 0;
    function animate() {
      // 持续旋转
      count += 0.01;
      cube2.rotation.x = Math.PI * count;
      controls.update();
      requestAnimationFrame(animate);
      // 渲染场景
      renderer.render(scene, camera);
    }
    animate();
    //****************  响应式画布  ***************** */
    // 监听窗口变化
    window.addEventListener('resize', () => {
      // 重置渲染器宽高比
      renderer.setSize(window.innerWidth, window.innerHeight);
      // 重置相机宽高比
      camera.aspect = window.innerWidth / window.innerHeight;
      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
    });
    //****************  gui调试控制  ***************** */
    let eventObj = {
      FullScreen() {
        document.body.requestFullscreen();
      },
      exitFullScreen() {
        document.exitFullscreen();
      },
    };
    // 创建GUI
    const gui = new GUI();
    gui.add(eventObj, 'FullScreen').name('全屏');
    gui.add(eventObj, 'exitFullScreen').name('退出全屏');
    let folder = gui.addFolder('立方体位置');
    folder
      .add(cube2.position, 'x')
      .min(-10)
      .max(10)
      .step(0.5)
      .name('子几何体x轴的位置');
  }, []);

  return <div></div>;
};

export default Light;
