import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
// 导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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
    // 创建纹理加载器
    let textureLoader = new THREE.TextureLoader();
    // 加载纹理
    const texturePath = '/texture/amber/base_color.jpg';
    let texture = textureLoader.load(texturePath);
    // 创建几何体
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    // 创建材质
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      transparent: true,
      reflectivity: 0.5,
    });
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
    // 使用索引创建子几何体
    const geometry3 = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      0,
      0,
      0, //顶点1
      0,
      1,
      0, //顶点2
      1,
      0,
      0, //顶点3
      1,
      1,
      0, //顶点4
    ]);
    geometry3.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    // 创建索引
    const indices = new Uint16Array([0, 1, 2, 1, 2, 3]);
    geometry3.setIndex(new THREE.BufferAttribute(indices, 1));
    // 划分顶点组
    geometry3.addGroup(0, 3, 0);
    geometry3.addGroup(3, 3, 1);
    // 创建材质
    const materialGroup1 = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      // 设置两面都可以看到
      side: THREE.DoubleSide,
    });
    const materialGroup2 = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      // 设置两面都可以看到
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry3, [materialGroup1, materialGroup2]);
    scene.add(plane);
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
    //****************  加载环境贴图  ***************** */
    // 获取hdr路径
    const envHdrPath = '/texture/Alex_Hart-Nature_Lab_Bones_2k.hdr';
    let rgbeLoader = new RGBELoader();
    rgbeLoader.load(envHdrPath, (envMap) => {
      // 设置球形贴图
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      // 设置环境贴图
      scene.background = envMap;
      // 设置环境贴图
      scene.environment = envMap;
      // 设置plane环境贴图
      // planeMaterial.envMap = envMap;
    });
    //****************  光线投射交互  ***************** */
    // 创建射线
    const raycaster = new THREE.Raycaster();
    // 创建鼠标向量
    const mouse = new THREE.Vector2();
    window.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      // 通过摄像机和鼠标位置更新射线
      raycaster.setFromCamera(mouse, camera);
      // 计算物体和射线的焦点
      const intersects = raycaster.intersectObjects([cube2]);
      if (intersects.length > 0) {
        console.log(intersects);
        (intersects[0].object as any).material.color.set(getRandomColor());
      }

      function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
    });
    //****************  雾  ***************** */
    scene.fog = new THREE.Fog(0x999999, 0.1, 10);
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
  }, []);

  return <div></div>;
};

export default Light;
