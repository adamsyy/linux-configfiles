// @ts-nocheck
/*
This helper can help for:
* adjusting the canvas resolution to the good size -> this is crucial to
optimize the code because if the canvas is too large,
there are too much pixels to compute => it will be slow

* to mirror horizontally or not the canvas -> if the front camera is used we
need it flipped (mirror effect), while if the rear camera is used we need it not flipped

* to get the best camera resolution (either above the canvas resolution or closer)
to balance between performance and quality
*/

/*
  Helper for Three.js
*/

"use strict";

var JeelizResizer = (function () {
  // private vars:
  let _domCanvas = null,
    _whCanvasPx = null,
    _resizeAttemptsCounter = 0,
    _overSamplingFactor = 1,
    _isFullScreen = false,
    _timerFullScreen = false,
    _callbackResize = false,
    _isInvFullscreenWH = false;

  const _cameraResolutions = [
    //all resolutions should be in landscape mode
    [640, 480],
    [768, 480],
    [800, 600],
    [960, 640],
    [960, 720],
    [1024, 768],
    [1280, 720],
    [1920, 1080]
  ];

  //private functions
  function add_CSStransform(domElement, CSS) {
    const CSStransform = domElement.style.transform;
    if (CSStransform.indexOf(CSS) !== -1) return;
    domElement.style.transform = CSS + " " + CSStransform;
  }

  // Compute overlap between 2 rectangles A and B
  // characterized by their width and their height in pixels
  // the rectangles are centered
  // return the ratio (pixels overlaped)/(total pixels)
  function compute_overlap(whA, whB) {
    const aspectRatioA = whA[0] / whA[1];
    const aspectRatioB = whB[0] / whB[1]; //higher aspectRatio -> more landscape

    var whLandscape, whPortrait;
    if (aspectRatioA > aspectRatioB) {
      (whLandscape = whA), (whPortrait = whB);
    } else {
      (whLandscape = whB), (whPortrait = whA);
    }

    // The overlapped area will be always a rectangle
    const areaOverlap =
      Math.min(whLandscape[0], whPortrait[0]) *
      Math.min(whLandscape[1], whPortrait[1]);

    var areaTotal;
    if (whLandscape[0] >= whPortrait[0] && whLandscape[1] >= whPortrait[1]) {
      //union is a rectangle
      areaTotal = whLandscape[0] * whLandscape[1];
    } else if (
      whPortrait[0] > whLandscape[0] &&
      whPortrait[1] > whLandscape[1]
    ) {
      //union is a rectangle
      areaTotal = whPortrait[0] * whPortrait[1];
    } else {
      //union is a cross
      areaTotal = whLandscape[0] * whLandscape[1];
      areaTotal += (whPortrait[1] - whLandscape[1]) * whPortrait[0];
    }

    return areaOverlap / areaTotal;
  } //end compute_overlap()

  function update_sizeCanvas() {
    const domRect = _domCanvas.getBoundingClientRect();
    _whCanvasPx = [
      Math.round(_overSamplingFactor * domRect.width),
      Math.round(_overSamplingFactor * domRect.height)
    ];
    _domCanvas.setAttribute("width", _whCanvasPx[0]);
    _domCanvas.setAttribute("height", _whCanvasPx[1]);
  }

  function on_windowResize() {
    if (_timerFullScreen) {
      clearTimeout(_timerFullScreen);
    }
    _timerFullScreen = setTimeout(resize_fullScreen, 50);
  }

  function resize_canvasToFullScreen() {
    _whCanvasPx = [window["innerWidth"], window["innerHeight"]];
    if (_isInvFullscreenWH) {
      _whCanvasPx.reverse();
    }
    _domCanvas.setAttribute("width", _whCanvasPx[0]);
    _domCanvas.setAttribute("height", _whCanvasPx[1]);
  }

  function resize_fullScreen() {
    resize_canvasToFullScreen();
    JEEFACEFILTERAPI.resize();
    _timerFullScreen = false;
    if (_callbackResize) {
      _callbackResize();
    }
  }

  // public methods:
  const that = {
    // return true or false if the device is in portrait or landscape mode
    // see https://stackoverflow.com/questions/4917664/detect-viewport-orientation-if-orientation-is-portrait-display-alert-message-ad
    is_portrait: function () {
      try {
        if (window["matchMedia"]("(orientation: portrait)")["matches"]) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return window["innerHeight"] > window["innerWidth"];
      }
    },

    // check whether the user is using IOS or not
    // see https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
    check_isIOS: function () {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator["userAgent"]) && !window["MSStream"];
      return isIOS;
    },

    // Should be called only if IOS was detected
    // see https://stackoverflow.com/questions/8348139/detect-ios-version-less-than-5-with-javascript
    get_IOSVersion: function () {
      const v = navigator["appVersion"].match(/OS (\d+)_(\d+)_?(\d+)?/);
      return v.length > 2
        ? [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)]
        : [0, 0, 0];
    },

    // Check whether the user is using Android or not
    // see https://stackoverflow.com/questions/6031412/detect-android-phone-via-javascript-jquery
    check_isAndroid: function () {
      const ua = navigator["userAgent"].toLowerCase();
      return ua.indexOf("android") !== -1;
    },

    // Should be called only if Android was detected
    // see https://stackoverflow.com/questions/7184573/pick-up-the-android-version-in-the-browser-by-javascript
    get_androidVersion: function () {
      const ua = navigator["userAgent"].toLowerCase();
      const match = ua.match(/android\s([0-9\.]*)/i);
      if (!match || match.length < 2) {
        return [0, 0, 0];
      }
      const v = match[1].split(".");
      return [parseInt(v[0], 10), parseInt(v[1], 10), parseInt(v[2] || 0, 10)];
    },

    // to get a video of 480x640 (480 width and 640 height)
    // with a mobile phone in portrait mode, the default implementation
    // should require a 480x640 video (Chrome, Firefox)
    // but bad implementations needs to always request landscape resolutions (so 640x480)
    // see https://github.com/jeeliz/jeelizFaceFilter/issues/144
    require_flipVideoWHIfPortrait: function () {
      // disabled because of https://github.com/jeeliz/jeelizFaceFilter/issues/144
      // seems quite a mess though...

      /* if (that.check_isIOS()){
        //the user is using IOS
        const version = that.get_IOSVersion();
        if (version[0] >= 13){
          if (version[1] <= 1 // IOS 13.0.X
              || (version[1] === 1 && version[2] < 3)){ // IOS 13.1.X with X<3
            return false;
          }
        }
      }
      if (that.check_isAndroid()){
        const version = that.get_androidVersion();
        if (version[0] >= 9){ // Android 9+
          return false;
        }
      } */

      // normal implementation
      return true;
    },

    // size canvas to the right resolution
    // should be called after the page loading
    // when the canvas has already the right size
    // options:
    //  - <string> canvasId: id of the canvas
    //  - <HTMLCanvasElement> canvas: if canvasId is not provided
    //  - <function> callback: function to launch if there was an error or not
    //  - <float> overSamplingFactor: facultative. If 1, same resolution than displayed size (default).
    //    If 2, resolution twice higher than real size
    //  - <boolean> CSSFlipX: if we should flip the canvas or not. Default: false
    //  - <boolean> isFullScreen: if we should set the canvas fullscreen. Default: false
    //  - <function> onResize: function called when the window is resized. Only enabled if isFullScreen=true
    //  - <boolean> isInvWH: if we should invert width and height for fullscreen mode only. default=false
    size_canvas: function (options) {
      _domCanvas = options.canvas
        ? options.canvas
        : document.getElementById(options.canvasId);
      _isFullScreen =
        typeof options.isFullScreen !== "undefined" && options.isFullScreen;
      _isInvFullscreenWH =
        typeof options.isInvWH !== "undefined" && options.isInvWH;

      if (_isFullScreen) {
        // we are in fullscreen mode
        if (typeof options.onResize !== "undefined") {
          _callbackResize = options.onResize;
        }
        resize_canvasToFullScreen();
        window.addEventListener("resize", on_windowResize, false);
        window.addEventListener("orientationchange", on_windowResize, false);
      } else {
        //not fullscreen mode

        // get display size of the canvas:
        const domRect = _domCanvas.getBoundingClientRect();
        if (domRect.width === 0 || domRect.height === 0) {
          console.log(
            "WARNING in JeelizResize.size_canvas(): the canvas has its width or its height null, Retry a bit later..."
          );
          if (++_resizeAttemptsCounter > 20) {
            options.callback("CANNOT_RESIZECANVAS");
            return;
          }
          setTimeout(that.size_canvas.bind(null, options), 50);
          return;
        }

        // do resize canvas:
        _resizeAttemptsCounter = 0;
        _overSamplingFactor =
          typeof options.overSamplingFactor === "undefined"
            ? 1
            : options.overSamplingFactor;
        update_sizeCanvas();
      }

      // flip horizontally if required:
      if (typeof options.CSSFlipX !== "undefined" && options.CSSFlipX) {
        add_CSStransform(_domCanvas, "rotateY(180deg)");
      }

      // compute the best camera resolutions:
      const allResolutions = _cameraResolutions.slice(0);

      // if we are in portrait mode, the camera is also in portrait mode
      // so we need to set all resolutions to portrait mode
      if (that.is_portrait() && that.require_flipVideoWHIfPortrait()) {
        allResolutions.forEach(function (wh) {
          wh.reverse();
        });
      }

      // scale canvas size to device pixel ratio:
      // (To find the correct resolution, especially for iOS one should consider the window.devicePixelRatio factor)
      const dpr = window.devicePixelRatio ? window.devicePixelRatio : 1;
      const whCanvasPxScaled = [_whCanvasPx[0] * dpr, _whCanvasPx[1] * dpr];

      // sort camera resolutions from the best to the worst:
      allResolutions.sort(function (resA, resB) {
        return (
          compute_overlap(resB, whCanvasPxScaled) -
          compute_overlap(resA, whCanvasPxScaled)
        );
      });

      // pick the best camera resolution:
      const bestCameraResolution = {
        idealWidth: allResolutions[0][0],
        idealHeight: allResolutions[0][1]
      };

      console.log(
        "INFO in JeelizResizer: bestCameraResolution =",
        bestCameraResolution
      );

      // launch the callback function after a small interval to let it
      // some time to size:
      setTimeout(options.callback.bind(null, false, bestCameraResolution), 1);
    }, //end size_canvas()

    // Should be called if the canvas is resized to update the canvas resolution:
    resize_canvas: function () {
      if (_isFullScreen) {
        return;
      }
      update_sizeCanvas();
    }
  }; //end that
  return that;
})();

THREE.JeelizHelper = (function () {
  // internal settings:
  const _settings = {
    rotationOffsetX: 0, // negative -> look upper. in radians
    pivotOffsetYZ: [0.4, 0.2], // XYZ of the distance between the center of the cube and the pivot. enable _settings.isDebugPivotPoint to set this value

    detectionThreshold: 0.8, // sensibility, between 0 and 1. Less -> more sensitive
    detectionHysteresis: 0.05,

    tweakMoveYRotateY: 0.5, // tweak value: move detection window along Y axis when rotate the face

    cameraMinVideoDimFov: 46, // Field of View for the smallest dimension of the video in degrees

    isDebugPivotPoint: false // display a small cube for the pivot point
  };

  // private vars:
  let _threeRenderer = null,
    _threeScene = null,
    _threeVideoMesh = null,
    _threeVideoTexture = null;

  let _maxFaces = -1,
    _isMultiFaces = false,
    _detectCallback = null,
    _isVideoTextureReady = false,
    _isSeparateThreejsCanvas = false,
    _faceFilterCv = null,
    _videoElement = null,
    _isDetected = false,
    _scaleW = 1;

  const _threeCompositeObjects = [],
    _threePivotedObjects = [];

  let _gl = null,
    _glVideoTexture = null,
    _glShpCopy = null;

  // private funcs:
  function destroy() {
    _isVideoTextureReady = false;
    _threeCompositeObjects.splice(0);
    _threePivotedObjects.splice(0);
    if (_threeVideoTexture) {
      _threeVideoTexture.dispose();
      _threeVideoTexture = null;
    }
  }

  function create_threeCompositeObjects() {
    for (let i = 0; i < _maxFaces; ++i) {
      // COMPOSITE OBJECT WHICH WILL TRACK A DETECTED FACE
      // in fact we create 2 objects to be able to shift the pivot point
      const threeCompositeObject = new THREE.Object3D();
      threeCompositeObject.frustumCulled = false;
      threeCompositeObject.visible = false;

      const threeCompositeObjectPIVOTED = new THREE.Object3D();
      threeCompositeObjectPIVOTED.frustumCulled = false;
      threeCompositeObject.add(threeCompositeObjectPIVOTED);

      _threeCompositeObjects.push(threeCompositeObject);
      _threePivotedObjects.push(threeCompositeObjectPIVOTED);
      _threeScene.add(threeCompositeObject);

      if (_settings.isDebugPivotPoint) {
        const pivotCubeMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.1, 0.1, 0.1),
          new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide,
            depthTest: false
          })
        );
        pivotCubeMesh.position.copy(threeCompositeObjectPIVOTED.position);
        threeCompositeObject.add(pivotCubeMesh);
        window.pivot = pivotCubeMesh;
        console.log(
          "DEBUG in JeelizHelper: set the position of <pivot> in the console and report the value into JeelizThreejsHelper.js for _settings.pivotOffsetYZ"
        );
      }
    }
  }

  function create_videoScreen() {
    const videoScreenVertexShaderSource =
      "attribute vec2 position;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_Position = vec4(position, 0., 1.);\n\
          vUV = 0.5+0.5*position;\n\
        }";
    const videoScreenFragmentShaderSource =
      "precision lowp float;\n\
        uniform sampler2D samplerVideo;\n\
        varying vec2 vUV;\n\
        void main(void){\n\
          gl_FragColor = texture2D(samplerVideo, vUV);\n\
        }";

    if (_isSeparateThreejsCanvas) {
      const compile_shader = function (source, type, typeString) {
        const shader = _gl.createShader(type);
        _gl.shaderSource(shader, source);
        _gl.compileShader(shader);
        if (!_gl.getShaderParameter(shader, _gl.COMPILE_STATUS)) {
          alert(
            "ERROR IN " +
              typeString +
              " SHADER: " +
              _gl.getShaderInfoLog(shader)
          );
          return false;
        }
        return shader;
      };

      const shader_vertex = compile_shader(
        videoScreenVertexShaderSource,
        _gl.VERTEX_SHADER,
        "VERTEX"
      );
      const shader_fragment = compile_shader(
        videoScreenFragmentShaderSource,
        _gl.FRAGMENT_SHADER,
        "FRAGMENT"
      );

      _glShpCopy = _gl.createProgram();
      _gl.attachShader(_glShpCopy, shader_vertex);
      _gl.attachShader(_glShpCopy, shader_fragment);

      _gl.linkProgram(_glShpCopy);
      const samplerVideo = _gl.getUniformLocation(_glShpCopy, "samplerVideo");

      return;
    }

    // init video texture with red:
    _threeVideoTexture = new THREE.DataTexture(
      new Uint8Array([255, 0, 0]),
      1,
      1,
      THREE.RGBFormat
    );
    _threeVideoTexture.needsUpdate = true;

    // CREATE THE VIDEO BACKGROUND:
    const videoMaterial = new THREE.RawShaderMaterial({
      depthWrite: false,
      depthTest: false,
      vertexShader: videoScreenVertexShaderSource,
      fragmentShader: videoScreenFragmentShaderSource,
      uniforms: {
        samplerVideo: { value: _threeVideoTexture }
      }
    });
    const videoGeometry = new THREE.BufferGeometry();
    const videoScreenCorners = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]);
    videoGeometry.addAttribute(
      "position",
      new THREE.BufferAttribute(videoScreenCorners, 2)
    );
    videoGeometry.setIndex(
      new THREE.BufferAttribute(new Uint16Array([0, 1, 2, 0, 2, 3]), 1)
    );
    _threeVideoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
    that.apply_videoTexture(_threeVideoMesh);
    _threeVideoMesh.renderOrder = -1000; // render first
    _threeVideoMesh.frustumCulled = false;
    _threeScene.add(_threeVideoMesh);
  } //end create_videoScreen()

  function detect(detectState) {
    _threeCompositeObjects.forEach(function (threeCompositeObject, i) {
      _isDetected = threeCompositeObject.visible;
      const ds = detectState[i];
      if (
        _isDetected &&
        ds.detected <
          _settings.detectionThreshold - _settings.detectionHysteresis
      ) {
        // DETECTION LOST
        if (_detectCallback) _detectCallback(i, false);
        threeCompositeObject.visible = false;
      } else if (
        !_isDetected &&
        ds.detected >
          _settings.detectionThreshold + _settings.detectionHysteresis
      ) {
        // FACE DETECTED
        if (_detectCallback) _detectCallback(i, true);
        threeCompositeObject.visible = true;
      }
    }); //end loop on all detection slots
  }

  function update_positions3D(ds, threeCamera) {
    const halfTanFOV = Math.tan(
      (threeCamera.aspect * threeCamera.fov * Math.PI) / 360
    ); //tan(<horizontal FoV>/2), in radians (threeCamera.fov is vertical FoV)

    _threeCompositeObjects.forEach(function (threeCompositeObject, i) {
      if (!threeCompositeObject.visible) return;
      const detectState = ds[i];

      // tweak Y position depending on rx:
      const tweak = _settings.tweakMoveYRotateY * Math.tan(detectState.rx);
      const cz = Math.cos(detectState.rz),
        sz = Math.sin(detectState.rz);

      const s = detectState.s * _scaleW;

      const xTweak = sz * tweak * s;
      const yTweak = cz * tweak * (s * threeCamera.aspect);

      // move the cube in order to fit the head:
      const W = s; //relative width of the detection window (1-> whole width of the detection window)
      const D = 1 / (2 * W * halfTanFOV); //distance between the front face of the cube and the camera

      //coords in 2D of the center of the detection window in the viewport:
      const xv = detectState.x * _scaleW + xTweak;
      const yv = detectState.y + yTweak;

      // coords in 3D of the center of the cube (in the view coordinates system)
      const z = -D - 0.5; // minus because view coordinate system Z goes backward. -0.5 because z is the coord of the center of the cube (not the front face)
      const x = xv * D * halfTanFOV;
      const y = (yv * D * halfTanFOV) / threeCamera.aspect;

      // the pivot position depends on rz rotation:
      _threePivotedObjects[i].position.set(
        -sz * _settings.pivotOffsetYZ[0],
        -cz * _settings.pivotOffsetYZ[0],
        -_settings.pivotOffsetYZ[1]
      );

      // move and rotate the cube:
      threeCompositeObject.position.set(
        x,
        y + _settings.pivotOffsetYZ[0],
        z + _settings.pivotOffsetYZ[1]
      );
      threeCompositeObject.rotation.set(
        detectState.rx + _settings.rotationOffsetX,
        detectState.ry,
        detectState.rz,
        "ZXY"
      );
    }); //end loop on composite objects
  }

  //public methods:
  const that = {
    // launched with the same spec object than callbackReady. set spec.threejsCanvasId to the ID of the threejsCanvas to be in 2 canvas mode:
    init: function (spec, detectCallback) {
      destroy();

      _maxFaces = spec.maxFacesDetected;
      _glVideoTexture = spec.videoTexture;
      _gl = spec.GL;
      _faceFilterCv = spec.canvasElement;
      _isMultiFaces = _maxFaces > 1;
      _videoElement = spec.videoElement;

      // enable 2 canvas mode if necessary:
      let threejsCanvas = null;
      if (spec.threejsCanvasId) {
        _isSeparateThreejsCanvas = true;
        // adjust the threejs canvas size to the threejs canvas:
        threejsCanvas = document.getElementById(spec.threejsCanvasId);
        threejsCanvas.setAttribute("width", _faceFilterCv.width);
        threejsCanvas.setAttribute("height", _faceFilterCv.height);
      } else {
        threejsCanvas = _faceFilterCv;
      }

      if (typeof detectCallback !== "undefined") {
        _detectCallback = detectCallback;
      }

      // init THREE.JS context:
      _threeRenderer = new THREE.WebGLRenderer({
        context: _isSeparateThreejsCanvas ? null : _gl,
        canvas: threejsCanvas,
        alpha: _isSeparateThreejsCanvas || spec.alpha ? true : false
      });

      _threeScene = new THREE.Scene();

      create_threeCompositeObjects();
      create_videoScreen();

      // handle device orientation change:
      window.addEventListener(
        "orientationchange",
        function () {
          setTimeout(JEEFACEFILTERAPI.resize, 1000);
        },
        false
      );

      const returnedDict = {
        videoMesh: _threeVideoMesh,
        renderer: _threeRenderer,
        scene: _threeScene
      };
      if (_isMultiFaces) {
        returnedDict.faceObjects = _threePivotedObjects;
      } else {
        returnedDict.faceObject = _threePivotedObjects[0];
      }
      return returnedDict;
    }, //end that.init()

    detect: function (detectState) {
      const ds = _isMultiFaces ? detectState : [detectState];

      // update detection states:
      detect(ds);
    },

    get_isDetected: function () {
      return _isDetected;
    },

    render: function (detectState, threeCamera) {
      const ds = _isMultiFaces ? detectState : [detectState];

      // update detection states:
      detect(ds);
      update_positions3D(ds, threeCamera);

      if (_isSeparateThreejsCanvas) {
        // render the video texture on the faceFilter canvas:
        _gl.viewport(0, 0, _faceFilterCv.width, _faceFilterCv.height);
        _gl.useProgram(_glShpCopy);
        _gl.activeTexture(_gl.TEXTURE0);
        _gl.bindTexture(_gl.TEXTURE_2D, _glVideoTexture);
        _gl.drawElements(_gl.TRIANGLES, 3, _gl.UNSIGNED_SHORT, 0);
      } else {
        // reinitialize the state of THREE.JS because JEEFACEFILTER have changed stuffs:
        // -> can be VERY costly !
        _threeRenderer.state.reset();
      }

      // trigger the render of the THREE.JS SCENE:
      _threeRenderer.render(_threeScene, threeCamera);
    },

    sortFaces: function (bufferGeometry, axis, isInv) {
      // sort faces long an axis
      // Useful when a bufferGeometry has alpha: we should render the last faces first
      const axisOffset = { X: 0, Y: 1, Z: 2 }[axis.toUpperCase()];
      const sortWay = isInv ? -1 : 1;

      // fill the faces array:
      const nFaces = bufferGeometry.index.count / 3;
      const faces = new Array(nFaces);
      for (let i = 0; i < nFaces; ++i) {
        faces[i] = [
          bufferGeometry.index.array[3 * i],
          bufferGeometry.index.array[3 * i + 1],
          bufferGeometry.index.array[3 * i + 2]
        ];
      }

      // compute centroids:
      const aPos = bufferGeometry.attributes.position.array;
      const centroids = faces.map(function (face, faceIndex) {
        return [
          (aPos[3 * face[0]] + aPos[3 * face[1]] + aPos[3 * face[2]]) / 3, //X
          (aPos[3 * face[0] + 1] +
            aPos[3 * face[1] + 1] +
            aPos[3 * face[2] + 1]) /
            3, //Y
          (aPos[3 * face[0] + 2] +
            aPos[3 * face[1] + 2] +
            aPos[3 * face[2] + 2]) /
            3, //Z
          face
        ];
      });

      // sort centroids:
      centroids.sort(function (ca, cb) {
        return (ca[axisOffset] - cb[axisOffset]) * sortWay;
      });

      // reorder bufferGeometry faces:
      centroids.forEach(function (centroid, centroidIndex) {
        const face = centroid[3];
        bufferGeometry.index.array[3 * centroidIndex] = face[0];
        bufferGeometry.index.array[3 * centroidIndex + 1] = face[1];
        bufferGeometry.index.array[3 * centroidIndex + 2] = face[2];
      });
    }, //end sortFaces

    get_threeVideoTexture: function () {
      return _threeVideoTexture;
    },

    apply_videoTexture: function (threeMesh) {
      if (_isVideoTextureReady) {
        return;
      }
      threeMesh.onAfterRender = function () {
        // Replace _threeVideoTexture.__webglTexture by the real video texture:
        try {
          _threeRenderer.properties.update(
            _threeVideoTexture,
            "__webglTexture",
            _glVideoTexture
          );
          _threeVideoTexture.magFilter = THREE.LinearFilter;
          _threeVideoTexture.minFilter = THREE.LinearFilter;
          _isVideoTextureReady = true;
        } catch (e) {
          console.log(
            "WARNING in THREE.JeelizHelper: the glVideoTexture is not fully initialized"
          );
        }
        delete threeMesh.onAfterRender;
      };
    },

    // create an occluder, IE a transparent object which writes on the depth buffer:
    create_threejsOccluder: function (occluderURL, callback) {
      const occluderMesh = new THREE.Mesh();
      new THREE.BufferGeometryLoader().load(occluderURL, function (
        occluderGeometry
      ) {
        const mat = new THREE.ShaderMaterial({
          vertexShader: THREE.ShaderLib.basic.vertexShader,
          fragmentShader:
            "precision lowp float;\n void main(void){\n gl_FragColor=vec4(1.,0.,0.,1.);\n }",
          uniforms: THREE.ShaderLib.basic.uniforms,
          colorWrite: false
        });

        occluderMesh.renderOrder = -1; //render first
        occluderMesh.material = mat;
        occluderMesh.geometry = occluderGeometry;
        if (typeof callback !== "undefined" && callback) callback(occluderMesh);
      });
      return occluderMesh;
    },

    set_pivotOffsetYZ: function (pivotOffset) {
      _settings.pivotOffsetYZ = pivotOffset;
    },

    create_camera: function (zNear, zFar) {
      const threeCamera = new THREE.PerspectiveCamera(
        1,
        1,
        zNear ? zNear : 0.1,
        zFar ? zFar : 100
      );
      that.update_camera(threeCamera);

      return threeCamera;
    },

    update_camera: function (threeCamera) {
      // compute aspectRatio:
      const canvasElement = _threeRenderer.domElement;
      const cvw = canvasElement.width;
      const cvh = canvasElement.height;
      const canvasAspectRatio = cvw / cvh;

      // compute vertical field of view:
      const vw = _videoElement.videoWidth;
      const vh = _videoElement.videoHeight;
      const videoAspectRatio = vw / vh;
      const fovFactor = vh > vw ? 1.0 / videoAspectRatio : 1.0;
      const fov = _settings.cameraMinVideoDimFov * fovFactor;

      // compute X and Y offsets in pixels:
      let scale = 1.0;
      if (canvasAspectRatio > videoAspectRatio) {
        // the canvas is more in landscape format than the video, so we crop top and bottom margins:
        scale = cvw / vw;
      } else {
        // the canvas is more in portrait format than the video, so we crop right and left margins:
        scale = cvh / vh;
      }
      const cvws = vw * scale,
        cvhs = vh * scale;
      const offsetX = (cvws - cvw) / 2.0;
      const offsetY = (cvhs - cvh) / 2.0;
      _scaleW = cvw / cvws;

      // apply parameters:
      threeCamera.aspect = canvasAspectRatio;
      threeCamera.fov = fov;
      console.log(
        "INFO in JeelizThreejsHelper.update_camera(): camera vertical estimated FoV is",
        fov,
        "deg"
      );
      threeCamera.setViewOffset(cvws, cvhs, offsetX, offsetY, cvw, cvh);
      threeCamera.updateProjectionMatrix();

      // update drawing area:
      _threeRenderer.setSize(cvw, cvh, false);
      _threeRenderer.setViewport(0, 0, cvw, cvh);
    }, //end update_camera()

    resize: function (w, h, threeCamera) {
      _threeRenderer.domElement.width = w;
      _threeRenderer.domElement.height = h;
      JEEFACEFILTERAPI.resize();
      if (threeCamera) {
        that.update_camera(threeCamera);
      }
    }
  };
  return that;
})();
