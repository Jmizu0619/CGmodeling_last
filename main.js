/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three/examples/jsm/loaders/GLTFLoader */ "./node_modules/three/examples/jsm/loaders/GLTFLoader.js");
/* harmony import */ var noisejs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! noisejs */ "./node_modules/noisejs/index.js");
/* harmony import */ var noisejs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(noisejs__WEBPACK_IMPORTED_MODULE_2__);




class ThreeJSContainer {
    scene;
    light;
    waveGeometry; // waveGeometryをクラスプロパティとして宣言
    waveGroup; // waveGroupもクラスプロパティとして宣言
    targetGroup;
    targetMesh;
    noise;
    // 波のアニメーション用変数
    waveAnimationTime = 0;
    WAVE_OFFSET_SPEED = 1.5; // 波が伝播する速さ (値を大きくすると速くなる)
    WAVE_AMPLITUDE = 0.8; // 波の振幅（高さ）
    WAVE_FREQUENCY = 0.5; // 波の頻度（波紋の密度）
    R_SIZE = 30; //分割した平面の1辺あたりの長さ
    SEGMENTS = 50; //セグメント数
    constructor() {
        this.noise = new noisejs__WEBPACK_IMPORTED_MODULE_2__.Noise(Math.random());
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_3__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x87cefa));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        renderer.toneMapping = three__WEBPACK_IMPORTED_MODULE_3__.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_3__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_3__.Scene();
        /* フィールドへ物理演算を導入&初期化
        const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.friction = 0.025;
        world.defaultContactMaterial.restitution = 0.9;
        */
        //オブジェクト作成
        this.targetGroup = new three__WEBPACK_IMPORTED_MODULE_3__.Group();
        //material
        let paramMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhysicalMaterial({
            color: 0x005591,
            roughness: 0.2,
            metalness: 0.0,
            transmission: 0.7,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            reflectivity: 0.9,
            ior: 1.33
        });
        let lineMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        //Geometry
        //1.ターゲットオブジェクト
        const geometry = new three__WEBPACK_IMPORTED_MODULE_3__.ConeGeometry(0.25, 1);
        const redMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial({ color: 0xFF0000 });
        const greenMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial({ color: 0x00FF00 });
        const blueMaterial = new three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial({ color: 0x0000FF });
        const redCone = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(geometry, redMaterial);
        const greenCone = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(geometry, greenMaterial);
        const blueCone = new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(geometry, blueMaterial);
        redCone.translateX(0.5);
        redCone.rotateZ(-Math.PI / 2);
        greenCone.translateY(0.5);
        blueCone.translateZ(0.5);
        blueCone.rotateX(Math.PI / 2);
        const obj = new three__WEBPACK_IMPORTED_MODULE_3__.Group();
        obj.add(redCone);
        obj.add(greenCone);
        obj.add(blueCone);
        //blenderで作成したモデルをインポート
        /*
        let loadOBJ = (objFilePath: string, mtlFilePath: string) => {
            let object = new THREE.Object3D;
            const mtlLoader = new MTLLoader();
            mtlLoader.load(mtlFilePath, (material) => {
                material.preload();
                const objLoader = new OBJLoader();
                objLoader.setMaterials(material);
                objLoader.load(objFilePath, (obj) => {
                    object.add(obj);

                })
            })
            return object;
        }
        const mesh = loadOBJ("robot.obj", "robot.mtl");
        */
        const loader = new three_examples_jsm_loaders_GLTFLoader__WEBPACK_IMPORTED_MODULE_1__.GLTFLoader();
        loader.load('robot.glb', (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
                if (child instanceof three__WEBPACK_IMPORTED_MODULE_3__.Mesh) {
                    const material = child.material;
                    if (material instanceof three__WEBPACK_IMPORTED_MODULE_3__.MeshStandardMaterial || material instanceof three__WEBPACK_IMPORTED_MODULE_3__.MeshPhysicalMaterial) {
                        material.roughness = 1.0;
                        material.metalness = 0.2;
                        material.needsUpdate = true;
                    }
                    else if (material instanceof three__WEBPACK_IMPORTED_MODULE_3__.MeshPhongMaterial) {
                        material.shininess = 30;
                        material.specular = new three__WEBPACK_IMPORTED_MODULE_3__.Color(0x111111);
                        material.needsUpdate = true;
                    }
                }
            });
            model.scale.set(0.5, 0.5, 0.5);
            model.position.setY(-0.3);
            model.position.setZ(0.8);
            model.rotateX(Math.PI / -2 * 0.8);
            this.targetGroup.add(model);
        });
        //this.targetGroup.add(obj);    確認用
        //this.targetGroup.add();     //ここに浮かべるオブジェクトを入れる
        this.scene.add(this.targetGroup);
        //2.波
        let wave = (u, v, target) => {
            let p = Math.PI;
            let r = this.R_SIZE;
            let x = u * r - r / 2;
            let z = v * r - r / 2;
            let y = Math.sin(0.8 * Math.sqrt(Math.pow(x / 2 - 10, 2) + Math.pow(z / 2 - 10, 2)));
            target.set(x, y, z);
        };
        this.waveGeometry = new three__WEBPACK_IMPORTED_MODULE_3__.ParametricGeometry(wave, this.SEGMENTS, this.SEGMENTS);
        this.waveGroup = new three__WEBPACK_IMPORTED_MODULE_3__.Group();
        this.waveGroup.add(new three__WEBPACK_IMPORTED_MODULE_3__.Mesh(this.waveGeometry, paramMaterial));
        //this.waveGroup.add(new THREE.LineSegments(this.waveGeometry, lineMaterial));
        this.scene.add(this.waveGroup);
        //波のアニメーション
        let waveAnimate = (time) => {
            this.waveAnimationTime += this.WAVE_OFFSET_SPEED * 0.01;
            const positionAttribute = this.waveGeometry.attributes.position;
            for (let i = 0; i <= this.SEGMENTS; i++) {
                const u = i / this.SEGMENTS;
                for (let j = 0; j <= this.SEGMENTS; j++) {
                    const v = j / this.SEGMENTS;
                    const x = u * this.R_SIZE - this.R_SIZE / 2;
                    const z = v * this.R_SIZE - this.R_SIZE / 2;
                    const dist = Math.sqrt(Math.pow(x / 2 - 10, 2) + Math.pow(z / 2 - 10, 2));
                    const y = this.WAVE_AMPLITUDE * Math.sin(this.WAVE_FREQUENCY * dist - this.waveAnimationTime);
                    const index = (i * (this.SEGMENTS + 1) + j);
                    positionAttribute.setXYZ(index, x, y, z);
                }
            }
            positionAttribute.needsUpdate = true;
            for (let i = 0; i <= this.SEGMENTS; i++) {
                for (let j = 0; j <= this.SEGMENTS; j++) {
                    const index = i * (this.SEGMENTS + 1) + j;
                    let pos = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3();
                    pos.fromBufferAttribute(this.waveGeometry.attributes.position, index);
                    let noiseValue = fbm2D(this.noise, pos.x * 0.2, pos.z * 0.2);
                    pos.y += noiseValue * 0.4;
                    this.waveGeometry.attributes.position.setY(index, pos.y);
                }
            }
            this.waveGeometry.attributes.position.needsUpdate = true;
            this.waveGeometry.computeVertexNormals();
            //波を他のオブジェクトに適応する処理
            this.getCenterPointInfo();
            if (this.targetGroup) {
                this.targetGroup.position.set(0, this.centerPointY, 0);
                const defalultUp = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(0, 1, 0);
                const rotationQuaternion = new three__WEBPACK_IMPORTED_MODULE_3__.Quaternion();
                rotationQuaternion.setFromUnitVectors(defalultUp, this.centerPointNormal);
                this.targetGroup.setRotationFromQuaternion(rotationQuaternion);
            }
            function fbm2D(noise, x, z, octaves = 4) {
                let value = 0;
                let amplitude = 0.5;
                let frequency = 1.0;
                for (let i = 0; i < octaves; i++) {
                    value += amplitude * noise.perlin2(x * frequency, z * frequency);
                    frequency *= 2.0;
                    amplitude *= 0.5;
                }
                return value;
            }
        };
        //物理演算空間でのオブジェクト作成
        //床の生成
        // グリッド表示
        /*
        const gridHelper = new THREE.GridHelper(10,);
        this.scene.add(gridHelper);

        // 軸表示
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);
        */
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_3__.DirectionalLight(0xfff8e5, 1.5);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(-0.8, 1, -0.2).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.light.castShadow = true;
        this.scene.add(this.light);
        const ambientLight = new three__WEBPACK_IMPORTED_MODULE_3__.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        let update = (time) => {
            waveAnimate(time);
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    centerPointY = 0;
    centerPointNormal = new three__WEBPACK_IMPORTED_MODULE_3__.Vector3();
    getCenterPointInfo = () => {
        // (x,z) = (0,0)に対応するu,vのインデックスを計算
        const uIndex = Math.round(this.SEGMENTS * 0.5);
        const vIndex = Math.round(this.SEGMENTS * 0.5);
        const vertexIndex = uIndex * (this.SEGMENTS + 1) + vIndex;
        const positionAttribute = this.waveGeometry.attributes.position;
        const normalAttribute = this.waveGeometry.attributes.normal;
        if (positionAttribute && normalAttribute) {
            this.centerPointY = positionAttribute.getY(vertexIndex);
            this.centerPointNormal.fromBufferAttribute(normalAttribute, vertexIndex);
        }
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_3__.Vector3(5, 5, 5));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_noisejs_index_js-node_modules_three_examples_jsm_controls_OrbitControls_-68a657"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XHJcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcclxuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyXCI7XHJcbmltcG9ydCB7IE5vaXNlIH0gZnJvbSAnbm9pc2Vqcyc7XHJcblxyXG5cclxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XHJcbiAgICBwcml2YXRlIHNjZW5lOiBUSFJFRS5TY2VuZTtcclxuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xyXG4gICAgcHJpdmF0ZSB3YXZlR2VvbWV0cnk6IFRIUkVFLlBhcmFtZXRyaWNHZW9tZXRyeTsgLy8gd2F2ZUdlb21ldHJ544KS44Kv44Op44K544OX44Ot44OR44OG44Kj44Go44GX44Gm5a6j6KiAXHJcbiAgICBwcml2YXRlIHdhdmVHcm91cDogVEhSRUUuR3JvdXA7IC8vIHdhdmVHcm91cOOCguOCr+ODqeOCueODl+ODreODkeODhuOCo+OBqOOBl+OBpuWuo+iogFxyXG4gICAgcHJpdmF0ZSB0YXJnZXRHcm91cDogVEhSRUUuR3JvdXA7XHJcbiAgICBwcml2YXRlIHRhcmdldE1lc2g6IFRIUkVFLk1lc2g7XHJcbiAgICBwcml2YXRlIG5vaXNlOiBOb2lzZTtcclxuXHJcbiAgICAvLyDms6Ljga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7PnlKjlpInmlbBcclxuICAgIHByaXZhdGUgd2F2ZUFuaW1hdGlvblRpbWU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFdBVkVfT0ZGU0VUX1NQRUVEOiBudW1iZXIgPSAxLjU7IC8vIOazouOBjOS8neaSreOBmeOCi+mAn+OBlSAo5YCk44KS5aSn44GN44GP44GZ44KL44Go6YCf44GP44Gq44KLKVxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBXQVZFX0FNUExJVFVERTogbnVtYmVyID0gMC44OyAvLyDms6Ljga7mjK/luYXvvIjpq5jjgZXvvIlcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgV0FWRV9GUkVRVUVOQ1k6IG51bWJlciA9IDAuNTsgLy8g5rOi44Gu6aC75bqm77yI5rOi57SL44Gu5a+G5bqm77yJXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFJfU0laRTogbnVtYmVyID0gMzA7ICAgLy/liIblibLjgZfjgZ/lubPpnaLjga4x6L6644GC44Gf44KK44Gu6ZW344GVXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IFNFR01FTlRTOiBudW1iZXIgPSA1MDsgICAgIC8v44K744Kw44Oh44Oz44OI5pWwXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5ub2lzZSA9IG5ldyBOb2lzZShNYXRoLnJhbmRvbSgpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlLvpnaLpg6jliIbjga7kvZzmiJAo6KGo56S644GZ44KL5p6g44GU44Go44GrKSpcclxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xyXG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg4N2NlZmEpKTtcclxuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXHJcbiAgICAgICAgcmVuZGVyZXIudG9uZU1hcHBpbmcgPSBUSFJFRS5BQ0VTRmlsbWljVG9uZU1hcHBpbmc7XHJcbiAgICAgICAgcmVuZGVyZXIudG9uZU1hcHBpbmdFeHBvc3VyZSA9IDEuMTtcclxuXHJcbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcclxuICAgICAgICBjb25zdCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsIHdpZHRoIC8gaGVpZ2h0LCAwLjEsIDEwMDApO1xyXG4gICAgICAgIGNhbWVyYS5wb3NpdGlvbi5jb3B5KGNhbWVyYVBvcyk7XHJcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG9yYml0Q29udHJvbHMgPSBuZXcgT3JiaXRDb250cm9scyhjYW1lcmEsIHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmNyZWF0ZVNjZW5lKCk7XHJcbiAgICAgICAgLy8g5q+O44OV44Os44O844Og44GudXBkYXRl44KS5ZG844KT44Gn77yMcmVuZGVyXHJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XHJcbiAgICAgICAgY29uc3QgcmVuZGVyOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XHJcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xyXG5cclxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XHJcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g44K344O844Oz44Gu5L2c5oiQKOWFqOS9k+OBpzHlm54pXHJcbiAgICBwcml2YXRlIGNyZWF0ZVNjZW5lID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICAgICAgLyog44OV44Kj44O844Or44OJ44G454mp55CG5ryU566X44KS5bCO5YWlJuWIneacn+WMllxyXG4gICAgICAgIGNvbnN0IHdvcmxkID0gbmV3IENBTk5PTi5Xb3JsZCh7IGdyYXZpdHk6IG5ldyBDQU5OT04uVmVjMygwLCAtOS44MiwgMCkgfSk7XHJcbiAgICAgICAgd29ybGQuZGVmYXVsdENvbnRhY3RNYXRlcmlhbC5mcmljdGlvbiA9IDAuMDI1O1xyXG4gICAgICAgIHdvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjk7XHJcbiAgICAgICAgKi9cclxuXHJcbiAgICAgICAgLy/jgqrjg5bjgrjjgqfjgq/jg4jkvZzmiJBcclxuICAgICAgICB0aGlzLnRhcmdldEdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XHJcbiAgICAgICAgLy9tYXRlcmlhbFxyXG5cclxuICAgICAgICBsZXQgcGFyYW1NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoUGh5c2ljYWxNYXRlcmlhbCh7XHJcbiAgICAgICAgICAgIGNvbG9yOiAweDAwNTU5MSxcclxuICAgICAgICAgICAgcm91Z2huZXNzOiAwLjIsXHJcbiAgICAgICAgICAgIG1ldGFsbmVzczogMC4wLFxyXG4gICAgICAgICAgICB0cmFuc21pc3Npb246IDAuNyxcclxuICAgICAgICAgICAgY2xlYXJjb2F0OiAxLjAsXHJcbiAgICAgICAgICAgIGNsZWFyY29hdFJvdWdobmVzczogMC4xLFxyXG4gICAgICAgICAgICByZWZsZWN0aXZpdHk6IDAuOSxcclxuICAgICAgICAgICAgaW9yOiAxLjMzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBsaW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHhmZmZmZmYsIHRyYW5zcGFyZW50OiB0cnVlLCBvcGFjaXR5OiAwLjUgfSk7XHJcblxyXG4gICAgICAgIC8vR2VvbWV0cnlcclxuICAgICAgICAvLzEu44K/44O844Ky44OD44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ29uZUdlb21ldHJ5KDAuMjUsIDEpO1xyXG4gICAgICAgIGNvbnN0IHJlZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4RkYwMDAwIH0pO1xyXG4gICAgICAgIGNvbnN0IGdyZWVuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHgwMEZGMDAgfSk7XHJcbiAgICAgICAgY29uc3QgYmx1ZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hQaG9uZ01hdGVyaWFsKHsgY29sb3I6IDB4MDAwMEZGIH0pO1xyXG4gICAgICAgIGNvbnN0IHJlZENvbmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgcmVkTWF0ZXJpYWwpO1xyXG4gICAgICAgIGNvbnN0IGdyZWVuQ29uZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBncmVlbk1hdGVyaWFsKTtcclxuICAgICAgICBjb25zdCBibHVlQ29uZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBibHVlTWF0ZXJpYWwpO1xyXG4gICAgICAgIHJlZENvbmUudHJhbnNsYXRlWCgwLjUpO1xyXG4gICAgICAgIHJlZENvbmUucm90YXRlWigtTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIGdyZWVuQ29uZS50cmFuc2xhdGVZKDAuNSk7XHJcbiAgICAgICAgYmx1ZUNvbmUudHJhbnNsYXRlWigwLjUpO1xyXG4gICAgICAgIGJsdWVDb25lLnJvdGF0ZVgoTWF0aC5QSSAvIDIpO1xyXG4gICAgICAgIGNvbnN0IG9iajogVEhSRUUuR3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcclxuICAgICAgICBvYmouYWRkKHJlZENvbmUpO1xyXG4gICAgICAgIG9iai5hZGQoZ3JlZW5Db25lKTtcclxuICAgICAgICBvYmouYWRkKGJsdWVDb25lKTtcclxuXHJcbiAgICAgICAgLy9ibGVuZGVy44Gn5L2c5oiQ44GX44Gf44Oi44OH44Or44KS44Kk44Oz44Od44O844OIXHJcbiAgICAgICAgLypcclxuICAgICAgICBsZXQgbG9hZE9CSiA9IChvYmpGaWxlUGF0aDogc3RyaW5nLCBtdGxGaWxlUGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0Q7XHJcbiAgICAgICAgICAgIGNvbnN0IG10bExvYWRlciA9IG5ldyBNVExMb2FkZXIoKTtcclxuICAgICAgICAgICAgbXRsTG9hZGVyLmxvYWQobXRsRmlsZVBhdGgsIChtYXRlcmlhbCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWwucHJlbG9hZCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqTG9hZGVyID0gbmV3IE9CSkxvYWRlcigpO1xyXG4gICAgICAgICAgICAgICAgb2JqTG9hZGVyLnNldE1hdGVyaWFscyhtYXRlcmlhbCk7XHJcbiAgICAgICAgICAgICAgICBvYmpMb2FkZXIubG9hZChvYmpGaWxlUGF0aCwgKG9iaikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdC5hZGQob2JqKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtZXNoID0gbG9hZE9CSihcInJvYm90Lm9ialwiLCBcInJvYm90Lm10bFwiKTtcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpO1xyXG4gICAgICAgIGxvYWRlci5sb2FkKCdyb2JvdC5nbGInLCAoZ2x0ZikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGdsdGYuc2NlbmU7XHJcblxyXG4gICAgICAgICAgICBtb2RlbC50cmF2ZXJzZSgoY2hpbGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZCBpbnN0YW5jZW9mIFRIUkVFLk1lc2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IGNoaWxkLm1hdGVyaWFsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0ZXJpYWwgaW5zdGFuY2VvZiBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCB8fCBtYXRlcmlhbCBpbnN0YW5jZW9mIFRIUkVFLk1lc2hQaHlzaWNhbE1hdGVyaWFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLnJvdWdobmVzcyA9IDEuMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwubWV0YWxuZXNzID0gMC4yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbC5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1hdGVyaWFsIGluc3RhbmNlb2YgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwuc2hpbmluZXNzID0gMzA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGVyaWFsLnNwZWN1bGFyID0gbmV3IFRIUkVFLkNvbG9yKDB4MTExMTExKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbW9kZWwuc2NhbGUuc2V0KDAuNSwgMC41LCAwLjUpO1xyXG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXRZKC0wLjMpO1xyXG4gICAgICAgICAgICBtb2RlbC5wb3NpdGlvbi5zZXRaKDAuOCk7XHJcbiAgICAgICAgICAgIG1vZGVsLnJvdGF0ZVgoTWF0aC5QSSAvIC0yICogMC44KTtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRHcm91cC5hZGQobW9kZWwpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy90aGlzLnRhcmdldEdyb3VwLmFkZChvYmopOyAgICDnorroqo3nlKhcclxuICAgICAgICAvL3RoaXMudGFyZ2V0R3JvdXAuYWRkKCk7ICAgICAvL+OBk+OBk+OBq+a1ruOBi+OBueOCi+OCquODluOCuOOCp+OCr+ODiOOCkuWFpeOCjOOCi1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMudGFyZ2V0R3JvdXApO1xyXG5cclxuICAgICAgICAvLzIu5rOiXHJcbiAgICAgICAgbGV0IHdhdmUgPSAodTogbnVtYmVyLCB2OiBudW1iZXIsIHRhcmdldDogVEhSRUUuVmVjdG9yMykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgcCA9IE1hdGguUEk7XHJcbiAgICAgICAgICAgIGxldCByID0gdGhpcy5SX1NJWkU7XHJcbiAgICAgICAgICAgIGxldCB4ID0gdSAqIHIgLSByIC8gMjtcclxuICAgICAgICAgICAgbGV0IHogPSB2ICogciAtIHIgLyAyO1xyXG4gICAgICAgICAgICBsZXQgeSA9IE1hdGguc2luKDAuOCAqIE1hdGguc3FydChNYXRoLnBvdyh4IC8gMiAtIDEwLCAyKSArIE1hdGgucG93KHogLyAyIC0gMTAsIDIpKSk7XHJcbiAgICAgICAgICAgIHRhcmdldC5zZXQoeCwgeSwgeik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMud2F2ZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBhcmFtZXRyaWNHZW9tZXRyeSh3YXZlLCB0aGlzLlNFR01FTlRTLCB0aGlzLlNFR01FTlRTKTtcclxuICAgICAgICB0aGlzLndhdmVHcm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xyXG4gICAgICAgIHRoaXMud2F2ZUdyb3VwLmFkZChuZXcgVEhSRUUuTWVzaCh0aGlzLndhdmVHZW9tZXRyeSwgcGFyYW1NYXRlcmlhbCkpO1xyXG4gICAgICAgIC8vdGhpcy53YXZlR3JvdXAuYWRkKG5ldyBUSFJFRS5MaW5lU2VnbWVudHModGhpcy53YXZlR2VvbWV0cnksIGxpbmVNYXRlcmlhbCkpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMud2F2ZUdyb3VwKTtcclxuXHJcbiAgICAgICAgLy/ms6Ljga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7NcclxuICAgICAgICBsZXQgd2F2ZUFuaW1hdGUgPSAodGltZTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMud2F2ZUFuaW1hdGlvblRpbWUgKz0gdGhpcy5XQVZFX09GRlNFVF9TUEVFRCAqIDAuMDE7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbkF0dHJpYnV0ZSA9IHRoaXMud2F2ZUdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24gYXMgVEhSRUUuQnVmZmVyQXR0cmlidXRlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5TRUdNRU5UUzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1ID0gaSAvIHRoaXMuU0VHTUVOVFM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSB0aGlzLlNFR01FTlRTOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ID0gaiAvIHRoaXMuU0VHTUVOVFM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB1ICogdGhpcy5SX1NJWkUgLSB0aGlzLlJfU0laRSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeiA9IHYgKiB0aGlzLlJfU0laRSAtIHRoaXMuUl9TSVpFIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdCA9IE1hdGguc3FydChNYXRoLnBvdyh4IC8gMiAtIDEwLCAyKSArIE1hdGgucG93KHogLyAyIC0gMTAsIDIpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuV0FWRV9BTVBMSVRVREUgKiBNYXRoLnNpbih0aGlzLldBVkVfRlJFUVVFTkNZICogZGlzdCAtIHRoaXMud2F2ZUFuaW1hdGlvblRpbWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IChpICogKHRoaXMuU0VHTUVOVFMgKyAxKSArIGopO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uQXR0cmlidXRlLnNldFhZWihpbmRleCwgeCwgeSwgeik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcG9zaXRpb25BdHRyaWJ1dGUubmVlZHNVcGRhdGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdGhpcy5TRUdNRU5UUzsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSB0aGlzLlNFR01FTlRTOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGkgKiAodGhpcy5TRUdNRU5UUyArIDEpICsgajtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBvcyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLmZyb21CdWZmZXJBdHRyaWJ1dGUodGhpcy53YXZlR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbiwgaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgbm9pc2VWYWx1ZSA9IGZibTJEKHRoaXMubm9pc2UsIHBvcy54ICogMC4yLCBwb3MueiAqIDAuMik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zLnkgKz0gbm9pc2VWYWx1ZSAqIDAuNDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53YXZlR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5zZXRZKGluZGV4LCBwb3MueSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy53YXZlR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbi5uZWVkc1VwZGF0ZSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMud2F2ZUdlb21ldHJ5LmNvbXB1dGVWZXJ0ZXhOb3JtYWxzKCk7XHJcblxyXG4gICAgICAgICAgICAvL+azouOCkuS7luOBruOCquODluOCuOOCp+OCr+ODiOOBq+mBqeW/nOOBmeOCi+WHpueQhlxyXG4gICAgICAgICAgICB0aGlzLmdldENlbnRlclBvaW50SW5mbygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50YXJnZXRHcm91cCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRHcm91cC5wb3NpdGlvbi5zZXQoMCwgdGhpcy5jZW50ZXJQb2ludFksIDApO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmFsdWx0VXAgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAxLCAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJvdGF0aW9uUXVhdGVybmlvbiA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKCk7XHJcbiAgICAgICAgICAgICAgICByb3RhdGlvblF1YXRlcm5pb24uc2V0RnJvbVVuaXRWZWN0b3JzKGRlZmFsdWx0VXAsIHRoaXMuY2VudGVyUG9pbnROb3JtYWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YXJnZXRHcm91cC5zZXRSb3RhdGlvbkZyb21RdWF0ZXJuaW9uKHJvdGF0aW9uUXVhdGVybmlvbik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZibTJEKG5vaXNlOiBOb2lzZSwgeDogbnVtYmVyLCB6OiBudW1iZXIsIG9jdGF2ZXMgPSA0KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgYW1wbGl0dWRlID0gMC41O1xyXG4gICAgICAgICAgICAgICAgbGV0IGZyZXF1ZW5jeSA9IDEuMDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2N0YXZlczsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgKz0gYW1wbGl0dWRlICogbm9pc2UucGVybGluMih4ICogZnJlcXVlbmN5LCB6ICogZnJlcXVlbmN5KTtcclxuICAgICAgICAgICAgICAgICAgICBmcmVxdWVuY3kgKj0gMi4wO1xyXG4gICAgICAgICAgICAgICAgICAgIGFtcGxpdHVkZSAqPSAwLjU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8v54mp55CG5ryU566X56m66ZaT44Gn44Gu44Kq44OW44K444Kn44Kv44OI5L2c5oiQXHJcblxyXG4gICAgICAgIC8v5bqK44Gu55Sf5oiQXHJcblxyXG4gICAgICAgIC8vIOOCsOODquODg+ODieihqOekulxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwLCk7XHJcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZ3JpZEhlbHBlcik7XHJcblxyXG4gICAgICAgIC8vIOi7uOihqOekulxyXG4gICAgICAgIGNvbnN0IGF4ZXNIZWxwZXIgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcig1KTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZChheGVzSGVscGVyKTtcclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICAvL+ODqeOCpOODiOOBruioreWumlxyXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZjhlNSwgMS41KTtcclxuICAgICAgICBjb25zdCBsdmVjID0gbmV3IFRIUkVFLlZlY3RvcjMoLTAuOCwgMSwgLTAuMikubm9ybWFsaXplKCk7XHJcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XHJcbiAgICAgICAgdGhpcy5saWdodC5jYXN0U2hhZG93ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmxpZ2h0KTtcclxuICAgICAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmLCAwLjgpO1xyXG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XHJcblxyXG4gICAgICAgIGxldCB1cGRhdGU6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcclxuXHJcbiAgICAgICAgICAgIHdhdmVBbmltYXRlKHRpbWUpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2VudGVyUG9pbnRZOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBjZW50ZXJQb2ludE5vcm1hbDogVEhSRUUuVmVjdG9yMyA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDZW50ZXJQb2ludEluZm8gPSAoKSA9PiB7XHJcbiAgICAgICAgLy8gKHgseikgPSAoMCwwKeOBq+WvvuW/nOOBmeOCi3UsduOBruOCpOODs+ODh+ODg+OCr+OCueOCkuioiOeul1xyXG4gICAgICAgIGNvbnN0IHVJbmRleCA9IE1hdGgucm91bmQodGhpcy5TRUdNRU5UUyAqIDAuNSk7XHJcbiAgICAgICAgY29uc3QgdkluZGV4ID0gTWF0aC5yb3VuZCh0aGlzLlNFR01FTlRTICogMC41KTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhJbmRleCA9IHVJbmRleCAqICh0aGlzLlNFR01FTlRTICsgMSkgKyB2SW5kZXg7XHJcblxyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQXR0cmlidXRlID0gdGhpcy53YXZlR2VvbWV0cnkuYXR0cmlidXRlcy5wb3NpdGlvbiBhcyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGU7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsQXR0cmlidXRlID0gdGhpcy53YXZlR2VvbWV0cnkuYXR0cmlidXRlcy5ub3JtYWwgYXMgVEhSRUUuQnVmZmVyQXR0cmlidXRlO1xyXG5cclxuICAgICAgICBpZiAocG9zaXRpb25BdHRyaWJ1dGUgJiYgbm9ybWFsQXR0cmlidXRlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyUG9pbnRZID0gcG9zaXRpb25BdHRyaWJ1dGUuZ2V0WSh2ZXJ0ZXhJbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2VudGVyUG9pbnROb3JtYWwuZnJvbUJ1ZmZlckF0dHJpYnV0ZShub3JtYWxBdHRyaWJ1dGUsIHZlcnRleEluZGV4KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcclxuXHJcbmZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcclxuXHJcbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKDUsIDUsIDUpKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlld3BvcnQpO1xyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gbm8gYmFzZVVSSVxuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8uaiA9IChjaHVua0lkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID09PSAwKTtcblxuLy8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG52YXIgd2VicGFja0pzb25wQ2FsbGJhY2sgPSAocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24sIGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWVdID0gZGF0YTtcblx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG5cdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuXHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwO1xuXHRpZihjaHVua0lkcy5zb21lKChpZCkgPT4gKGluc3RhbGxlZENodW5rc1tpZF0gIT09IDApKSkge1xuXHRcdGZvcihtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuXHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYocnVudGltZSkgdmFyIHJlc3VsdCA9IHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdH1cblx0aWYocGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24pIHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuXHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oaW5zdGFsbGVkQ2h1bmtzLCBjaHVua0lkKSAmJiBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcblx0XHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSgpO1xuXHRcdH1cblx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHR9XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLk8ocmVzdWx0KTtcbn1cblxudmFyIGNodW5rTG9hZGluZ0dsb2JhbCA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdIHx8IFtdO1xuY2h1bmtMb2FkaW5nR2xvYmFsLmZvckVhY2god2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCAwKSk7XG5jaHVua0xvYWRpbmdHbG9iYWwucHVzaCA9IHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2guYmluZChjaHVua0xvYWRpbmdHbG9iYWwpKTsiLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGRlcGVuZHMgb24gb3RoZXIgbG9hZGVkIGNodW5rcyBhbmQgZXhlY3V0aW9uIG5lZWQgdG8gYmUgZGVsYXllZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8odW5kZWZpbmVkLCBbXCJ2ZW5kb3JzLW5vZGVfbW9kdWxlc19ub2lzZWpzX2luZGV4X2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiaXRDb250cm9sc18tNjhhNjU3XCJdLCAoKSA9PiAoX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2FwcC50c1wiKSkpXG5fX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9