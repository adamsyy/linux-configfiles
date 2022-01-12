
/*
        Created by Floppian
        Licensed under GNU General Public License
        For those of you unaware of that license -
        Please visit
        https://choosealicense.com/licenses/gpl-3.0/

      */

if (location.pathname.match(/\-/g).length >= 2) { // Google Meeting


  (async (checkForIssues) => {
    navigator.mediaDevices.getUserMedia = MediaDevices.prototype.getUserMedia.bind(
      navigator.mediaDevices
    );

    let Noty = function ({ text }) {
      this.text = text;
      this.show = () => alert(this.text);
    };
    let external = false;
    if (window.realUserMediaCall) external = "vb";
    if (window.tryGetVideoElement) external = "vb";

    if (external) {a
      return new Noty({
        theme: "relax",
        type: "warning",
        layout: "topCenter",
        timeout: 3000,
        text:
          "Visual Effects Warning:\n Using other extensions that interfere with the camera can result in issues with Visual Effects"
      }).show();
    } else return
  })()

  class OpticElement {
    constructor(type, options) {

      /*
      let tempTypes = ["text", "line", "empty", "checkbox"];
      let tempOptions = {
        text: "",
        parent: "",
        label: "",
        labelData: {
          name: "",
          id: "",
          slider: { min: 1, max: 100 },
          upload: { accept: ["image/png", "image/jpeg"], text: "" },
          input: { placeholder: "", maxLength: 20 }
        },
        id: "",
        class: "",
        listeners: [{ selector: "", events: [""], listener: "" }]
      };
      */

      this.parentElem = document.querySelector(options.parent || ".optic-menu");
      this.type = type;
      this.options = options;
      this.listeners = this.options.listeners || [];

      // CREATES ELEMENT
      this.createElem();

      // ALLOWS INTERACTION WITH ELEMENT
      this.addListeners();
    }

    createElem() {
      switch (this.type) {
        case "text":
          let textElement = document.createElement("a");

          let className = "optic-checked" + (this.options.bold ? " bold" : "") + (this.options.underline ? " underline" : "") + (this.options.class ? " " + this.options.class : "");
          textElement.setAttribute("class", className);
          textElement.setAttribute("id", this.options.id || "");
          if (this.options.fontSize) textElement.style.fontSize = this.options.fontSize;
          if (this.options.onClick) textElement.addEventListener('click', () => {
            this.options.onClick();
          });

          textElement.textContent = this.options.text;

          this.parentElem.appendChild(textElement);
          this.self = this.parentElem.lastChild;
          break;

        case "line":
          let hrElement = document.createElement("hr");

          hrElement.setAttribute("id", this.options.id || "");
          hrElement.setAttribute("class", this.options.class || "");
          hrElement.setAttribute("width", "50%");

          this.parentElem.appendChild(hrElement);
          this.self = this.parentElem.lastChild;
          break;

        case "empty":
          let breakElement = document.createElement("br");

          breakElement.setAttribute("id", this.options.id || "");
          breakElement.setAttribute("class", this.options.class || "");

          this.parentElem.appendChild(breakElement);
          this.self = this.parentElem.lastChild;
          break;

        case "checkbox":
          // INIT REQUIRED ELEMENTS
          let labelElement = document.createElement("label");
          let labelName = document.createElement("a");

          labelElement.setAttribute("class", "optic-select");
          labelName.setAttribute("class", "optic-checked");

          labelName.appendChild(
            document.createTextNode(this.options.labelData.name)
          );
          labelElement.appendChild(labelName);

          // CREATE CHECKBOX
          let checkboxElement = document.createElement("input");
          let checkDisplay = document.createElement("span");
          checkboxElement.setAttribute("type", "checkbox");
          checkboxElement.setAttribute(
            "id",
            this.options.labelData.id + "-box"
          );
          checkDisplay.setAttribute("class", "optic-check");

          labelElement.appendChild(checkboxElement);
          labelElement.appendChild(checkDisplay);

          // RADIO SYMBOL INPUT
          if (this.options.labelData.radio) {
            this.options.labelData.radio.radios.forEach((radio, i, radios) => {
              let radioInput = document.createElement("input");
              let radioLabel = document.createElement("label");
              let id =
                radio.value.toLowerCase() +
                "-" +
                this.options.labelData.id +
                "-radio";
              let type =
                i == 0 ? "left" : i == radios.length - 1 ? "right" : "middle";

              if (i == 0 && !this.options.labelData.radio.checked)
                radioInput.setAttribute("checked", "checked");
              if (i + 1 == this.options.labelData.radio.checked)
                radioInput.setAttribute("checked", "checked");
              radioInput.setAttribute("type", "radio");
              radioInput.setAttribute("class", "optic-null optic-rinput");
              radioInput.setAttribute(
                "name",
                this.options.labelData.radio.name
              );
              radioInput.setAttribute("id", id);
              radioLabel.setAttribute("for", id);

              radioLabel.setAttribute(
                "class",
                id.replace("-radio", "-trigger ") + type + " optic-radio"
              );

              radioLabel.appendChild(document.createTextNode(radio.value));

              labelElement.appendChild(radioInput);
              labelElement.appendChild(radioLabel);
            });
          }

          // RANGE INPUT
          if (this.options.labelData.slider) {
            let rangeInput = document.createElement("input");

            rangeInput.setAttribute("type", "range");
            rangeInput.setAttribute("min", this.options.labelData.slider.min);
            rangeInput.setAttribute("max", this.options.labelData.slider.max);

            let value =
              this.options.labelData.slider.value ||
              Math.floor(
                this.options.labelData.slider.min / 2 +
                this.options.labelData.slider.max / 2
              );
            rangeInput.setAttribute("value", value);
            rangeInput.setAttribute("class", "optic-slider");
            rangeInput.setAttribute("id", this.options.labelData.id + "-rate");

            labelElement.appendChild(rangeInput);
          }

          // TEXT INPUT
          if (this.options.labelData.input) {
            let textInput = document.createElement("input");

            textInput.setAttribute(
              "id",
              this.options.labelData.id + "-text-input"
            );
            textInput.setAttribute("type", "text");
            textInput.setAttribute("class", "optic-input");
            textInput.setAttribute(
              "placeholder",
              this.options.labelData.input.placeholder || "Lorem Ispum..."
            );
            textInput.setAttribute(
              "maxLength",
              this.options.labelData.input.maxLength || -1
            );

            labelElement.appendChild(textInput);
          }

          // FILE INPUT
          if (this.options.labelData.upload) {
            let fileInput = document.createElement("input");
            let inputDisplay = document.createElement("label");
            fileInput.setAttribute("id", this.options.labelData.id + "-inp");
            fileInput.setAttribute("type", "file");
            fileInput.setAttribute(
              "accept",
              this.options.labelData.upload.accept.join(", ")
            );
            inputDisplay.setAttribute("class", "optic-file");
            inputDisplay.setAttribute("for", fileInput.id);

            inputDisplay.appendChild(
              document.createTextNode(
                this.options.labelData.upload.text || "Upload"
              )
            );
            labelElement.appendChild(fileInput);
            labelElement.appendChild(inputDisplay);
          }

          this.parentElem.appendChild(labelElement);
          this.self = this.parentElem.lastChild;
          break;
        
        case "image":
          let imageElement = document.createElement("img");

          imageElement.setAttribute("id", this.options.id || "");
          imageElement.setAttribute("class", this.options.class || "");
          imageElement.setAttribute("src", this.options.src || "");
          if (this.options.onClick) imageElement.addEventListener('click', () => {
            this.options.onClick();
          });

          this.parentElem.appendChild(imageElement);
          this.self = this.parentElem.lastChild;
      }
    }

    addListeners() {
      if (!this.listeners.length) return;

      this.listeners.forEach((listenerData) => {
        listenerData.events.forEach((event) => {
          document
            .querySelector(listenerData.selector)
            .addEventListener(event, listenerData.listener);
        });
      });
    }
  }

  // Main Hijacker and Effecter
  class GoogleMeetOptics {
    constructor(userType = 1) {

      // Welcome Message
      console.log(
        "%c Visual Effects %c for Google Meet",
        "border-radius: 3px 0px 0px 3px; padding: 1%; font-size:1.3em; font-weight: 500; background-color: #00796A; font-family: Google Sans; sans-serif; color: white",
        "border-radius: 0px 3px 3px 0px; padding: 1%; font-size:1.3em; font-weight: 400; background-color: #058377; font-family: Google Sans; sans-serif; color: white"
      );

      this.network = false;

      this.FX = {
        Two: {
          Misha: {
            Misha: null,
            active: false
          },
          Rainbow: {
            hue: 1,
            interval: setInterval((e) => {
              Client.FX.Two.Rainbow.hue = Math.floor(
                Math.sin(Date.now() * 0.001) * 127 + 128
              );
            }),
            active: false
          },
          Bokeh: {
            tensorConfig: {
              internalResolution: "low",
              segmentationThreshold: 0.5,
              maxDetections: 2,
              scoreThreshold: 0,
              nmsRadius: 20,
              flipHorizontal: true
            },
            active: false,
            rate: 3,
            edgeRate: 10
          },
          Inverse: {
            active: false
          },
          Blur: { active: false, rate: 50 },
          Flip: { active: false },
          Text: { active: false, style: "default", value: "Lorem Ipsum" },
          Contrast: { active: false, rate: 128 },
          GreenScreen: {
            tensorConfig: {
              internalResolution: "high",
              segmentationThreshold: 0.5,
              maxDetections: 2,
              scoreThreshold: 0.3,
              nmsRadius: 20,
              flipHorizontal: true
            },
            canvas: null,
            img: false,
            IT: "img",
            active: false,
            url: "",
            type: +window.localStorage.greenType ? "new" : "old",
            ctx: null,
            tolerance: 1
          },
          Insane: { active: false },
          D3Movie: { active: false },
          Pixelate: { active: false, rate: 0.1 },
          SoftBlur: {
            active: false,
            rate: 9,
            url: window.OpticFiles.images.softblur,
            img: false
          }
        },
        Three: {
          FaceFilters: ["Halo", "Graduate", "Sunglasses"],
          Halo: {
            url: "/angel/tinker.obj",
            active: false,
            objects: [],
            stored: {
              position: [0, 5.5, -5.75]
            }
          },
          Graduate: {
            url: "/graduate/tinker.obj",
            active: false,
            objects: [],
            stored: {
              fragSRC:
                "precision lowp float;\n\
              uniform sampler2D samplerVideo;\n\
              varying vec2 vUVvideo;\n\
              varying float vY, vNormalDotZ;\n\
              void main() {\n\
                vec3 videoColor=texture2D(samplerVideo, vUVvideo).rgb;\n\
                float darkenCoeff=smoothstep(-0.15, 0.15, vY);\n\
                float borderCoeff=smoothstep(0.0, .4, vNormalDotZ);\n\
                gl_FragColor=vec4(videoColor*(1.), borderCoeff );\n\
                // gl_FragColor=vec4(borderCoeff, 255.0, 255.0, 1.);\n\
                // gl_FragColor=vec4(darkenCoeff, 255.0, 255.0, 1.);\n\
              }",
              position: [0, -3, -2.75],
              scalar: 28.12
            }
          },
          Sunglasses: {
            url: "/pixelsunglasses/tinker.obj",
            active: false,
            objects: [],
            stored: {
              position: [0, 5.5, -0.75]
            }
          },
          Cube: {
            active: false,
            objects: [],
            stored: {}
          },
          Bubbles: {
            active: false,
            objects: [],
            stored: {}
          }
        }
      };
      this.Freeze = false;
      this.name = false;
      this.state = 0b000;
      this.userType = userType;
      this.Preferences = {
        Window: {
          width: 1,
          height: 1,
          status: 0,
          titlebar: 0,
          title: "Google Meet Developer Optics"
        },
        VideoConstraints: {
          optics: true,
          video: true,
          audio: false
        }
      };
      this.editStream = null;
      this.videoStream = null;
      this.UI = { Labels: {} };
      this.init();
      this.initiateNet({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2
      });
    }
    async init() {
      this.state = 0b000;
      await this.setUpProxy();
      await this.createManipElements();
    }
    async initThree(spec) {
      // console.log("FACELOADED");
      while (!window.THREE) {
        await new Promise((r) => setTimeout(r, 500));
      }

      this.FX.Three.threeStuffs = THREE.JeelizHelper.init(spec, (a, c) => { }
        // console.log(c && !this.userType ? "Face DETECTED" : "Face LOST")
      );

      // Native Integration
      this.FX.Three.Scene = this.FX.Three.threeStuffs.scene;
      this.FX.Three.Camera = THREE.JeelizHelper.create_camera();
      this.FX.Three.Renderer = this.FX.Three.threeStuffs.renderer;

      // Jeeliz Modern
      this.FX.Three.VideoMesh = this.FX.Three.threeStuffs.videoMesh;
      this.FX.Three.FaceObject = this.FX.Three.threeStuffs.faceObject;

      this.FX.Three.Scene.position.z = 9;
      this.FX.Three.Camera.position.z = 9;

      // CUBE
      this.FX.Three.Cube.stored.texture = new window.THREE.Texture(this.input);
      this.FX.Three.Cube.stored.texture.wrapS = window.THREE.RepeatWrapping;
      this.FX.Three.Cube.stored.texture.wrapT = window.THREE.RepeatWrapping;
      this.FX.Three.Cube.stored.texture.repeat.set(1, 1);
      this.FX.Three.Cube.objects.push(
        new window.THREE.Mesh(
          new window.THREE.BoxGeometry(2, 2, 2, 2),
          new window.THREE.MeshBasicMaterial({
            map: this.FX.Three.Cube.stored.texture
          })
        )
      );
      this.FX.Three.Cube.objects[0].position.z -= 5;

      //  BUBBLES //
      this.FX.Three.Bubbles.stored.texture = new window.THREE.Texture(
        this.input
      );
      this.FX.Three.Bubbles.stored.geometry = new THREE.SphereBufferGeometry(
        0.1,
        32,
        16
      );
      this.FX.Three.Bubbles.stored.material = new window.THREE.MeshBasicMaterial(
        {
          map: this.FX.Three.Bubbles.stored.texture
        }
      );
      for (var i = 0; i < 200; i++) {
        let mesh = new THREE.Mesh(
          this.FX.Three.Bubbles.stored.geometry,
          this.FX.Three.Bubbles.stored.material
        );

        mesh.position.x = Math.random() * 40 - 20;
        mesh.position.y = Math.random() * 40 - 20;
        mesh.position.z = Math.random() * 40 - 20;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 6 + 1;

        this.FX.Three.Bubbles.objects.push(mesh);
      }

      //   HALO ///
      await (async () => {
        let lightsource = new THREE.DirectionalLight(0xffaa00, 1);
        lightsource.position.z = lightsource.position.y = 3.5;
        let lightsource2 = new THREE.DirectionalLight(0xffaa00, 0.5);
        lightsource2.position.z = 3.5;
        lightsource2.position.y = -3.5;

        this.FX.Three.Halo.objects = (
          await this.loadOBJ(
            this.FX.Three.Halo.stored,
            [lightsource, lightsource2],
            this.FX.Three.Halo.url,
            (root) => {
              root.rotateX((-90 * Math.PI) / 180);
              root.position.y = 1;
              root.scale.set(0.1, 0.1, 0.1);
              return root;
            }
          )
        ).objects;
      })();
      //  GRADUATE
      await (async () => {
        let lightSource = new THREE.DirectionalLight(0xffffff, 0.1);
        lightSource.position.z = lightSource.position.y = 3.5;

        this.FX.Three.Graduate.objects = (
          await this.loadOBJ(
            this.FX.Three.Graduate.stored,
            [lightSource],
            this.FX.Three.Graduate.url,
            (root) => {
              root.position.y = 0.5;
              root.scale.set(0.04, 0.04, 0.04);
              return root;
            }
          )
        ).objects;
      })();
      // SUNGLASSES
      await (async () => {
        let lightSource = new THREE.DirectionalLight(0xffffff, 0.1);
        lightSource.position.z = lightSource.position.y = 3.5;

        this.FX.Three.Sunglasses.objects = (
          await this.loadOBJ(
            this.FX.Three.Sunglasses.stored,
            [lightSource],
            this.FX.Three.Sunglasses.url,
            (root) => {
              root.rotateX((-90 * Math.PI) / 180);
              root.position.x = -0.03;
              root.position.y = 0.03;

              root.scale.set(0.07, 0.07, 0.07);
              return root;
            }
          )
        ).objects;
      })();
    }

    loadOBJ(faceMesh, lightSources, url, edit) {
      return new Promise((res) => {
        let objLoader = new OBJLoader2();
        objLoader.addMaterials(
          new THREE.MeshPhongMaterial({
            shininess: 1,
            color: 0xffff00,
            emissive: 0x000000,
            specular: 0xffffff
            // questions: "it just works"
          })
        );

        objLoader.load(
          "https://visualeffectsbackend.herokuapp.com/api/static" + url,
          (root) => {
            root = edit(root);

            const maskLoader = new THREE.BufferGeometryLoader();
            maskLoader.load(
              "https://visualeffectsbackend.herokuapp.com/api/static/faceLowPolyEyesEarsFill2.json",
              function (maskBufferGeometry) {
                const vertexShaderSource =
                  "varying vec2 vUVvideo;\n\
        varying float vY, vNormalDotZ;\n\
        const float THETAHEAD=0.25;\n\
        void main() {\n\
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0);\n\
          vec4 projectedPosition=projectionMatrix * mvPosition;\n\
          gl_Position=projectedPosition;\n\
          \n\
          //compute UV coordinates on the video texture :\n\
          vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
          vec4 projectedPosition0=projectionMatrix * mvPosition0;\n\
          vUVvideo=vec2(0.5,0.5)+0.5*projectedPosition0.xy/projectedPosition0.w;\n\
          vY=position.y*cos(THETAHEAD)-position.z*sin(THETAHEAD);\n\
          vec3 normalView=vec3(modelViewMatrix * vec4(normal,0.));\n\
          vNormalDotZ=pow(abs(normalView.z), 1.5);\n\
        }";

                const fragmentShaderSource =
                  faceMesh.fragSRC ||
                  "precision lowp float;\n\
    uniform sampler2D samplerVideo;\n\
    varying vec2 vUVvideo;\n\
    varying float vY, vNormalDotZ;\n\
    void main() {\n\
      vec3 videoColor=texture2D(samplerVideo, vUVvideo).rgb;\n\
      float darkenCoeff=smoothstep(-0.15, 0.15, vY);\n\
      float borderCoeff=smoothstep(0.0, 0.85, vNormalDotZ);\n\
      gl_FragColor=vec4(videoColor*(1.), borderCoeff );\n\
      // gl_FragColor=vec4(borderCoeff, 255.0, 255.0, 1.);\n\
      // gl_FragColor=vec4(darkenCoeff, 255.0, 255.0, 1.);\n\
    }";

                const mat = new THREE.ShaderMaterial({
                  vertexShader: vertexShaderSource,
                  fragmentShader: fragmentShaderSource,
                  transparent: true,
                  flatShading: false,
                  uniforms: {
                    samplerVideo: {
                      value: THREE.JeelizHelper.get_threeVideoTexture()
                    }
                  }
                });
                maskBufferGeometry.computeVertexNormals();

                let FakeFace = new THREE.Mesh(maskBufferGeometry, mat);
                FakeFace.frustumCulled = false;
                FakeFace.scale.multiplyScalar(faceMesh.scalar || 13.12);
                FakeFace.position.set(...faceMesh.position);
                FakeFace.rotateX((90 * Math.PI) / 180);
                root.add(FakeFace);
                lightSources.forEach(
                  (lightSource) => (lightSource.target = root)
                );
                lightSources.push(root);
                res({ objects: lightSources });
              }
            );
          }
        );
      });
    }
    disableAll() {
      this.Freeze = false;
      Object.keys(this.FX.Two).forEach((effectName) => {
        let effect = this.FX.Two[effectName];
        if (effect.active) {
          effect.active = false;
        }
      });
      Object.keys(this.FX.Three).forEach((effectName) => {
        let effect = this.FX.Three[effectName];
        if (effect.active && effect.stored) {
          effect.active = false;
        }
      });
      document
        .querySelectorAll(".optic-menu input[type='checkbox']")
        .forEach((e) => {
          e.checked = false;
        });
      Client.FX.Two.Misha.active = true;
    }
    toggle() {
      this.state = 7;
    }
    async linkUp() {
      // this.editStream = this.canvas.captureStream();
      this.paintCanvas();
      await this.createUIElements();
      this.disableAll();
      this.toggle();
    }
    setUpProxy() {
      window.DevOptics = window.DevOptics || {};
      window.DevOptics.getUserMediaProxy =
        window.DevOptics.getUserMediaProxy ||
        MediaDevices.prototype.getUserMedia ||
        navigator.mediaDevices.getUserMedia;

      MediaDevices.prototype.getUserMedia = navigator.mediaDevices.getUserMedia = async function () {
        // console.log(arguments[0]);
        try {
          if (arguments[0].video.deviceId && !arguments[0].jeelizUsage) {
            if (!this.userType)
              console.log(
                "%c Google Video recording - Filter",
                "background-color: #058377;"
              );

            try {
              return await this.filterRecording(arguments[0]);
            } catch (err) {
              if (!this.userType)
                console.log(
                  "%c Error Recording Video",
                  "background-color: #058377;",
                  err
                );
              return null;
            }
          } else {
            if (!this.userType)
              console.log(
                "%c Audio Recording - Bypass",
                "background-color: #058377;"
              );
            try {
              return await window.DevOptics.getUserMediaProxy.call(
                window.navigator.mediaDevices,
                arguments[0]
              );
            } catch (err) {
              if (!this.userType)
                console.log(
                  "%c Error Recording Video",
                  "background-color: #058377;",
                  err
                );
              return null;
            }
          }
        } catch (err) {
          if (!this.userType)
            console.log(
              "%c Audio Recording - Bypass",
              "background-color: #058377;"
            );
          try {
            return await window.DevOptics.getUserMediaProxy.call(
              window.navigator.mediaDevices,
              arguments[0]
            );
          } catch (err) {
            if (!this.userType)
              console.log(
                "%c Error Recording Video",
                "background-color: #058377;",
                err
              );
            return null;
          }
        }
      }.bind(this);
      this.state |= 2;
    }
    setBackground() {
      return new Promise((r) => {
        if (!this.FX.Two.GreenScreen.ctx || !this.FX.Two.GreenScreen.url) r();
        if (this.FX.Two.GreenScreen.IT.includes("video")) {
          let background = document.createElement("video");
          background.src = this.FX.Two.GreenScreen.url;
          background.addEventListener(
            "loadedmetadata",
            useImage.bind(this),
            false
          );
          function useImage() {
            background.loop = true;
            background.muted = true;
            background.volume = 0;
            background.play();
            this.FX.Two.GreenScreen.img = background;
            r();
          }
        } else {
          var background = new Image();
          background.crossOrigin = "Anonymous";
          background.src = this.FX.Two.GreenScreen.url;

          background.addEventListener("load", useImage.bind(this), false);
          function useImage() {
            this.FX.Two.GreenScreen.img = background;
            r();
          }
        }
      });
    }
    async updateGreen(tick) {
      requestAnimationFrame(
        function () {
          this.updateGreen(tick);
        }.bind(this)
      );
      try {
        if (this.FX.Two.GreenScreen.img) {
          this.FX.Two.GreenScreen.canvas.width = this.input.videoWidth;
          this.FX.Two.GreenScreen.canvas.height = this.input.videoHeight;
          this.FX.Two.GreenScreen.ctx.clearRect(
            0,
            0,
            this.FX.Two.GreenScreen.canvas.width,
            this.FX.Two.GreenScreen.canvas.height
          );
          this.FX.Two.GreenScreen.ctx.drawImage(
            this.FX.Two.GreenScreen.img,
            0,
            0,
            this.FX.Two.GreenScreen.canvas.width,
            this.FX.Two.GreenScreen.canvas.height
          );
        }
      } catch (err) { }
    }
    createManipElements() {
      return new Promise((r, err) => {
        try {
          var threeCanv = document.createElement("canvas");
          threeCanv.id = "three-canv";
          var input = document.createElement("video");
          input.id = "optic-input";
          input.autoplay = true;
          var imgStorage = document.createElement("canvas");
          imgStorage.id = "optic-img";

          this.updateGreen();
          var editCanv = document.createElement("canvas");
          editCanv.id = "canvas";
          var storage = document.createElement("canvas");
          storage.id = "optic-storage";
          let softblur = new Image();
          softblur.crossOrigin = "Anonymous";
          softblur.src = this.FX.Two.SoftBlur.url;

          softblur.addEventListener("load", addNodes.bind(this), false);
          function addNodes() {
            document.body.appendChild(input);
            document.body.appendChild(editCanv);
            document.body.appendChild(threeCanv);
            document.body.appendChild(storage);
            document.body.appendChild(imgStorage);
            this.input = document.querySelector("#optic-input");
            this.FX.Two.GreenScreen.canvas = document.querySelector(
              "#optic-img"
            );
            this.FX.Two.GreenScreen.storageCanvas = document.querySelector(
              "#optic-storage"
            );
            this.FX.Two.GreenScreen.storageCtx = this.FX.Two.GreenScreen.storageCanvas.getContext(
              "2d"
            );
            this.FX.Two.SoftBlur.img = softblur;
            this.canvas = document.querySelector("#canvas");
            this.threeCanv = threeCanv;
            this.ctx = this.canvas.getContext("2d");
            this.FX.Two.GreenScreen.ctx = this.FX.Two.GreenScreen.canvas.getContext(
              "2d"
            );
            this.FX.Two.Misha.Misha = new Misha(this.ctx, {
              x: this.canvas.width / 20,
              y: this.canvas.height / 2,
              clock: 2,
              width: 40
            });
            Client.FX.Two.Misha.active = true;
            this.state |= 1;
            ("none");
            r();
          }
        } catch (error) {
          console.log(
            "%c Video Recording Error:\n",
            "background-color: #058377;",
            err
          );
          err(error);
        }
      });
    }
    jeelizInit() {
      JEEFACEFILTERAPI.init({
        followZRot: true,
        canvasId: "three-canv",
        NNCpath: "https://visualeffectsbackend.herokuapp.com/api/static/", // root of NNC.json file
        maxFacesDetected: 1,
        callbackReady: (errCode, spec) => {
          if (errCode) {
            console.log("AN ERROR HAPPENed. ERR =", errCode);
            return;
          }
          console.log(this);
          this.initThree(spec);
          // console.log("INFO: JEEFACEFILTERAPI IS READY");
        },

        // called at each render iteration (drawing loop):
        callbackTrack: (detectState) => {
          THREE.JeelizHelper.render(detectState, this.FX.Three.Camera);
        }
      });
    }
    async createUIElements() {
      while (document.querySelector(".d7iDfe") !== null) {
        await new Promise((r) => setTimeout(r, 500));
      }
      while (document.querySelectorAll(".optic-menu").length >= 1) {
        try {
          document.querySelectorAll(".optic-menu")[0].remove()
        } catch {}
      }
      const t1 = document.body.appendChild(document.createElement('div'));
      t1.className = "optic-menu";
      t1.appendChild(document.createElement('br'));
      // Sometimes 2?
      new OpticElement("text", { text: "Visual Effects", bold: true });
      new OpticElement("line", {});
      this.UI.Labels.Bokeh = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Background Blur",
          id: "bokeh",
          slider: { min: 1, max: 20, value: 18 },
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#bokeh-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Bokeh.active = e.target.checked;
              if (e.target.checked) {
                this.initiateNet({
                  architecture: "MobileNetV1",
                  outputStride: 16,
                  multiplier: 0.5,
                  quantBytes: 2
                });
              }
            }.bind(this)
          },
          {
            selector: "#bokeh-rate",
            events: ["input", "change"],
            listener: function (event) {
              // This'll be updated
              this.FX.Two.Bokeh.rate =
                21 - parseInt(document.getElementById("bokeh-rate").value);
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Blur = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Blur",
          id: "blur",
          slider: { min: 1, max: 99 },
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#blur-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Blur.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          },
          {
            selector: "#blur-rate",
            events: ["input", "change"],
            listener: function (event) {
              // This'll be updated
              this.FX.Two.Blur.rate =
                100 - parseInt(document.getElementById("blur-rate").value);
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Bubbles = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Bubbles",
          id: "bubbles",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#bubbles-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Three.Bubbles.active = e.target.checked;
              if (this.FX.Three.Bubbles.active) {
                this.FX.Three.Scene.background = this.FX.Three.Bubbles.stored.texture;
                this.FX.Three.Bubbles.objects.forEach((bubble) => {
                  this.FX.Three.Scene.add(bubble);
                });
              } else {
                this.FX.Three.Scene.background = null;
                this.FX.Three.Bubbles.objects.forEach((bubble) => {
                  this.FX.Three.Scene.remove(bubble);
                });
              }
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Contrast = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Contrast",
          id: "contrast",
          slider: { min: 1, max: 255 },
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#contrast-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Contrast.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          },
          {
            selector: "#contrast-rate",
            events: ["input", "change"],
            listener: function (event) {
              // This'll be updated
              this.FX.Two.Contrast.rate =
                256 - parseInt(document.getElementById("contrast-rate").value);
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Cube = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Cube",
          id: "cube",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#cube-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Three.Cube.active = e.target.checked;
              if (this.FX.Three.Cube.active) {
                this.FX.Three.Scene.add(this.FX.Three.Cube.objects[0]);
              } else {
                this.FX.Three.Scene.remove(this.FX.Three.Cube.objects[0]);
              }
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.D3Movie = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "3D Movie",
          id: "d3movie",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#d3movie-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.D3Movie.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Misha = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Donation",
          id: "misha",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#misha-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Misha.Misha.sendRandomDonation();
              e.target.checked = false;
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Flip = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Flip",
          id: "flip",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#flip-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Flip.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Freeze = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Freeze",
          id: "freeze",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#freeze-box",
            events: ["input"],
            listener: function (e) {
              this.Freeze = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Inverse = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Inverse",
          id: "inverse",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#inverse-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Inverse.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Insane = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Insane",
          id: "insane",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#insane-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Insane.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Rainbow = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Rainbow",
          id: "rainbow",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#rainbow-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Rainbow.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Pixelate = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Pixelate",
          id: "pixel",
          slider: { min: 1, max: 128 },
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#pixel-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Pixelate.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          },
          {
            selector: "#pixel-rate",
            events: ["input", "change"],
            listener: function (event) {
              // This'll be updated
              this.FX.Two.Pixelate.rate =
                parseInt(document.getElementById("pixel-rate").value) / 300;
            }.bind(this)
          }
        ]
      });

      new OpticElement("line", {});
      this.UI.Labels.SoftBlur = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Soft Focus",
          id: "softblur",
          slider: { min: 0, max: 10, value: 1 },
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#softblur-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.SoftBlur.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          },
          {
            selector: "#softblur-rate",
            events: ["input", "change"],
            listener: function (event) {
              // This'll be updated
              this.FX.Two.SoftBlur.rate =
                10 - document.getElementById("softblur-rate").value;
            }.bind(this)
          }
        ]
      });

      new OpticElement("line", {});
      this.UI.Labels.ShowText = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Text Display",
          id: "text-display",
          slider: false,
          upload: false, //{ accept: ["image/png", "image/jpeg"], text: "" },
          input: { maxLength: 30, placeholder: "Text May Seem Flipped" }
        },
        listeners: [
          {
            selector: "#text-display-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Text.active = e.target.checked;
              if (e.target.checked) {
              }
            }.bind(this)
          },
          {
            selector: "#text-display-text-input",
            events: ["input"],
            listener: function (e) {
              this.FX.Two.Text.value = e.target.value || "Lorem Ipsum";
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.GreenScreen = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Green Screen",
          id: "green",
          upload: {
            accept: ["image/png", "image/jpeg", "video/mp4"],
            text: "Upload Background"
          },
          radio: {
            name: "type",
            checked: window.localStorage.greenType || 1,
            radios: [
              {
                value: "Default"
              },
              {
                value: "Virtual"
              }
            ]
          }
        },
        listeners: [
          {
            selector: "#default-green-radio",
            events: ["click"],
            listener: function (e) {
              if (document.querySelector("#default-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "old";
                window.localStorage.greenType = 1;
              }
              if (!document.querySelector("#default-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "new";
                window.localStorage.greenType = 2;
              }
            }.bind(this)
          },
          {
            selector: "#virtual-green-radio",
            events: ["click"],
            listener: function (e) {
              if (document.querySelector("#virtual-green-radio").checked) {
                this.initiateNet({
                  architecture: "MobileNetV1",
                  outputStride: 16,
                  multiplier: 0.75,
                  quantBytes: 2
                });
                this.FX.Two.GreenScreen.type = "new";
                window.localStorage.greenType = 2;
              }
              if (!document.querySelector("#virtual-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "old";
                window.localStorage.greenType = 1;
              }
            }.bind(this)
          },
          {
            selector: ".default-green-trigger",
            events: ["click"],
            listener: function (e) {
              if (document.querySelector("#default-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "old";
                window.localStorage.greenType = 1;
              }
              if (!document.querySelector("#default-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "new";
                window.localStorage.greenType = 2;
              }
            }.bind(this)
          },
          {
            selector: ".virtual-green-trigger",
            events: ["click"],
            listener: function (e) {
              if (document.querySelector("#virtual-green-radio").checked) {
                this.initiateNet({
                  architecture: "MobileNetV1",
                  outputStride: 16,
                  multiplier: 0.75,
                  quantBytes: 2
                });
                this.FX.Two.GreenScreen.type = "new";
                window.localStorage.greenType = 2;
              }
              if (!document.querySelector("#virtual-green-radio").checked) {
                this.FX.Two.GreenScreen.type = "old";
                window.localStorage.greenType = 1;
              }
            }.bind(this)
          },
          {
            selector: "#green-box",
            events: ["input"],
            listener: function (e) {
              if (!this.FX.Two.GreenScreen.img) {
                e.target.checked = false;
                return alert("Must select a file first :)");
              }
              if (e.target.checked) {
                this.disableAll();
                e.target.checked = true;
              }
              this.FX.Two.GreenScreen.active = e.target.checked;
            }.bind(this)
          },
          {
            selector: "#green-inp",
            events: ["change"],
            listener: function (e) {
              this.FX.Two.GreenScreen.url = URL.createObjectURL(
                e.target.files[0]
              );
              document
                .querySelector("label.optic-file")
                .classList.add("selected");
              this.FX.Two.GreenScreen.IT = e.target.files[0].type;
              this.setBackground();
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      new OpticElement("text", { text: "Face Filters!", bold: true });
      new OpticElement("line", {});
      this.UI.Labels.Sunglasses = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Sunglasses",
          id: "sunglasses",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#sunglasses-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Three.Sunglasses.active = e.target.checked;
              if (this.FX.Three.Sunglasses.active) {
                this.FX.Three.Sunglasses.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.add(obj);
                });
              } else {
                this.FX.Three.Sunglasses.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.remove(obj);
                });
              }
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Graduate = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Graduate",
          id: "graduate",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#graduate-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Three.Graduate.active = e.target.checked;
              if (this.FX.Three.Graduate.active) {
                this.FX.Three.Graduate.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.add(obj);
                });
              } else {
                this.FX.Three.Graduate.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.remove(obj);
                });
              }
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      this.UI.Labels.Halo = new OpticElement("checkbox", {
        parent: ".optic-menu",
        labelData: {
          name: "Halo",
          id: "halo",
          slider: false,
          upload: false //{ accept: ["image/png", "image/jpeg"], text: "" },
        },
        listeners: [
          {
            selector: "#halo-box",
            events: ["input"],
            listener: function (e) {
              this.FX.Three.Halo.active = e.target.checked;
              if (this.FX.Three.Halo.active) {
                this.FX.Three.Halo.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.add(obj);
                });
              } else {
                this.FX.Three.Halo.objects.forEach((obj) => {
                  this.FX.Three.FaceObject.remove(obj);
                });
              }
              if (e.target.checked) {
              }
            }.bind(this)
          }
        ]
      });
      new OpticElement("line", {});
      // new OpticElement("text", { text: "Try Toucan!", underline: true, bold: true, fontSize: "1.1em", onClick() {
      //   window.open('https://jointoucan.com/partners/visualeffects');
      // } });
      new OpticElement("image", { src: window.OpticFiles.images.toucan, onClick() {
        window.open('https://jointoucan.com/partners/visualeffects');
      }}).self.setAttribute("width", "65%");

      new OpticElement("empty", {});
      new OpticElement("empty", {});
      this.toggle();
    }
    async recordEdit(constraints) {
      try {
        this.editStream = this.canvas.captureStream();
        this.videoStream = await this.recordVideo(constraints);
        this.input.srcObject = this.videoStream;
      } catch (err) {
        if (!this.userType)
          console.log(
            "%c Video Recording Error:\n",
            "background-color: #058377;",
            err
          );
      }
      return this.editStream;
    }
    async recordVideo(constraints) {
      JeelizResizer.size_canvas({
        canvasId: "three-canv",
        callback: (isError, bestVideoSettings) => {
          this.jeelizInit(bestVideoSettings);
          if (isError) console.error("ERROR JEELIZ : ", isError);
        }
      });
      this.videoStream = null;
      try {
        if (window.DevOptics) {
          this.videoStream = await window.DevOptics.getUserMediaProxy.call(
            navigator.mediaDevices,
            constraints
          );
          // this.videoStream = await navigator.mediaDevices.getUserMedia(
          //   this.Preferences.VideoConstraints
          // );
        } else {
          this.videoStream = await navigator.mediaDevices.getUserMedia(
            constraints
          );
        }
      } catch (err) {
        if (!this.userType)
          console.log(
            "%c Video Recording Error:\n",
            "background-color: #058377;",
            err
          );
      }
      this.linkUp();
      const _stop = MediaStreamTrack.prototype.stop;
      this.editStream.getVideoTracks()[0].stop = () => {
        this.videoStream.getVideoTracks()[0].stop();
        _stop.call(this.editStream.getVideoTracks()[0]);
        JEEFACEFILTERAPI.destroy();
      };
      return this.videoStream;
    }
    async recordAudio(constraints) {
      var audioStream = null;
      try {
        if (window.DevOptics.getUserMediaProxy) {
          audioStream = await window.DevOptics.getUserMediaProxy.call(
            navigator.mediaDevices,
            constraints
          );
        } else {
          audioStream = await navigator.mediaDevices.getUserMedia(constraints);
        }
      } catch (err) {
        if (!this.userType)
          console.log(
            "%c Video Recording Error:\n",
            "background-color: #058377;",
            err
          );
      }
      return audioStream;
    }
    async filterRecording(constraints) {
      return await this.recordEdit(constraints);
    }
    editPixel(inputData, greenData, p) {
      if (this.FX.Two.GreenScreen.type == "old") {
        if (
          inputData[0] + inputData[2] <
          inputData[1] + this.FX.Two.GreenScreen.tolerance
        ) {
          inputData[0] = greenData[0];
          inputData[1] = greenData[1];
          inputData[2] = greenData[2];
          inputData[3] = greenData[3];
          return inputData;
        }
        return inputData;
      } else if (this.FX.Two.GreenScreen.type == "new") {
        // -0.72 - 1.2;
        var alpha = inputData[1] / 255;
        alpha = 1 - alpha;

        return this.blendPixel(
          [
            this.storedImg[p],
            this.storedImg[p + 1],
            this.storedImg[p + 2],
            this.storedImg[p + 3]
          ],
          greenData,
          alpha
        ); // 0 = full green
      }
    }
    blendPixel(color1, color2, alpha) {
      let r = Math.floor(color1[0] * alpha + color2[0] * (1 - alpha));
      let g = Math.floor(color1[1] * alpha + color2[1] * (1 - alpha));
      let b = Math.floor(color1[2] * alpha + color2[2] * (1 - alpha));
      return [r, g, b, 255];
    }
    async initiateNet(options) {
      this.network = await bodyPix.load();
    }
    async findSegments(effect) {
      this.input.width = this.input.videoWidth;
      this.input.height = this.input.videoHeight;
      return await this.network.segmentPerson(
        this.input,
        this.FX.Two[effect].tensorConfig
      );
    }
    async addGreen(tick) {
      // if (tick.toString().slice(-2) == "00") this.disableAll();
      this.FX.Two.GreenScreen.storageCanvas.width = this.input.videoWidth;
      this.FX.Two.GreenScreen.storageCanvas.height = this.input.videoHeight;
      this.FX.Two.GreenScreen.storageCtx.drawImage(
        this.input,
        0,
        0,
        this.input.videoWidth,
        this.input.videoHeight
      );
      this.storedImg = this.FX.Two.GreenScreen.storageCtx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      ).data;
      let segments = await this.findSegments("GreenScreen");
      let mask = bodyPix.toMask(
        segments,
        { r: 0, g: 0, b: 0, a: 255 },
        { r: 255, g: 255, b: 255, a: 255 }
      );
      bodyPix.drawMask(this.canvas, this.input, mask, 1, 2, false);
    }
    async addBokeh(tick) {
      // if (tick.toString().slice(-2) == "00") this.disableAll();
      let segments = await this.findSegments("Bokeh");
      bodyPix.drawBokehEffect(
        this.canvas,
        this.input,
        segments,
        +this.FX.Two.Bokeh.rate,
        this.FX.Two.Bokeh.edgeRate,
        false
      );
    }
    async addGreenScreen(tick) {
      return new Promise((res) => {
        try {
          var imageData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          ).data;
          var bgData = this.FX.Two.GreenScreen.ctx.getImageData(
            0,
            0,
            this.FX.Two.GreenScreen.canvas.width,
            this.FX.Two.GreenScreen.canvas.height
          ).data;
          this.FX.Two.GreenScreen.tolerance =
            this.FX.Two.GreenScreen.tolerance || 0;
          var len = imageData.length;

          for (var p = 0; p < len; p += 4) {
            let n = this.editPixel(
              [
                imageData[p],
                imageData[p + 1],
                imageData[p + 2],
                imageData[p + 3]
              ],
              [bgData[p], bgData[p + 1], bgData[p + 2], bgData[p + 3]],
              p
            );
            imageData[p] = n[0];
            imageData[p + 1] = n[1];
            imageData[p + 2] = n[2];
            imageData[p + 3] = n[3];
          }
          this.ctx.putImageData(
            new ImageData(imageData, this.canvas.width, this.canvas.height),
            0,
            0
          );
        } catch (err) {
          if (!this.userType)
            console.log(
              "%c Green Screen:\n",
              "background-color: #058377;",
              err
            );
        }
        res();
      });
    }
    async addRainbow(tick) {
      this.ctx.globalCompositeOperation = "hue";
      this.ctx.fillStyle = "hsl(" + this.FX.Two.Rainbow.hue + ",1000%, 50%)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    async addInverse(tick) {
      return new Promise((res) => {
        try {
          var imageData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
          var data = imageData.data;
          var len = data.length;

          for (var j = 0; j < len; j += 4) {
            data[j] = 255 - data[j];
            data[j + 1] = 255 - data[j + 1];
            data[j + 2] = 255 - data[j + 2];
          }
          this.ctx.putImageData(imageData, 0, 0);
        } catch (err) {
          if (!this.userType)
            console.log(
              "%c Inverse Color:\n",
              "background-color: #058377;",
              err
            );
        }
        res();
      });
    }
    async addContrast(tick) {
      return new Promise((res) => {
        //https://www.dfstudios.co.uk/articles/programming/image-programming-algorithms/image-processing-algorithms-part-5-contrast-adjustment/
        try {
          var imageData = this.ctx.getImageData(
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
          var data = imageData.data;
          var factor =
            (259 * (this.FX.Two.Contrast.rate + 255)) /
            (255 * (259 - this.FX.Two.Contrast.rate));
          var len = data.length;

          for (var i = 0; i < len; i += 4) {
            data[i] = factor * (data[i] - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
          }
          this.ctx.putImageData(imageData, 0, 0);
        } catch (err) {
          if (!this.userType)
            console.log(
              "%c Contrast Color:\n",
              "background-color: #058377;",
              err
            );
        }

        res();
      });
    }
    async addText(text = "Lorem Ipsum") {
      this.ctx.font = "bold 50px Google Sans, Impact, sans-serif";
      this.ctx.fillStyle = "white";
      this.ctx.strokeStyle = "7px black";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        text,
        this.canvas.width / 2,
        100,
        this.canvas.width - 20
      );
      this.ctx.strokeText(
        text,
        this.canvas.width / 2,
        100,
        this.canvas.width - 20
      );
    }
    async pixelateCanv(tick) {
      return new Promise((res) => {
        try {
          this.FX.Two.Pixelate.rate = this.FX.Two.Pixelate.rate || 0.1;
          var w = this.canvas.width * this.FX.Two.Pixelate.rate;
          var h = this.canvas.height * this.FX.Two.Pixelate.rate;

          this.ctx.drawImage(this.canvas, 0, 0, w, h);

          this.ctx.msImageSmoothingEnabled = false;
          this.ctx.mozImageSmoothingEnabled = false;
          this.ctx.webkitImageSmoothingEnabled = false;
          this.ctx.imageSmoothingEnabled = false;

          this.ctx.drawImage(
            this.canvas,
            0,
            0,
            w,
            h,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
        } catch (err) {
          if (!this.userType)
            console.log(
              "%c Green Screen:\n",
              "background-color: #058377;",
              err
            );
        }
        res();
      });
    }
    async applySoftBlur(tick) {
      this.ctx.globalAlpha = this.FX.Two.SoftBlur.rate / 10;
      this.ctx.drawImage(
        this.FX.Two.SoftBlur.img,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.ctx.globalAlpha = 1;
    }
    async paint(tick) {
      // Where the fun happens
      if (this.state >>> 2 && (this.state & 0b010) >>> 1) {
        try {
          // GreenScreen - Currently needs work
          if (this.FX.Two.GreenScreen.active) {
            await this.addGreenScreen(tick);
          }
          if (this.FX.Two.Misha.active) {
            this.FX.Two.Misha.index = this.FX.Two.Misha.Misha.update(
              this.FX.Two.Misha.index || 1
            );
          }
          if (this.FX.Two.Pixelate.active) {
            await this.pixelateCanv(tick);
          }

          if (this.FX.Two.Blur.active) {
            await boxBlurCanvasRGB(
              "canvas",
              0,
              0,
              this.canvas.width,
              this.canvas.height,
              this.FX.Two.Blur.rate,
              1
            );
          }
          if (this.FX.Two.Inverse.active) {
            await this.addInverse(tick);
          }
          if (this.FX.Two.D3Movie.active) {
            await apply3DMovie(this.ctx);
          }
          if (this.FX.Two.Insane.active) {
            await applyInsane(this.ctx);
          }
          if (this.FX.Two.SoftBlur.active) {
            await this.applySoftBlur();
          }
          if (this.FX.Two.Text.active) {
            await this.addText(this.FX.Two.Text.value);
          }
          if (this.FX.Two.Rainbow.active) {
            await this.addRainbow();
          }
          if (this.FX.Two.Contrast.active) {
            await this.addContrast(tick);
          }
          if (this.FX.Two.Flip.active) {
            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.rotate((180 * Math.PI) / 180);
            this.ctx.drawImage(
              this.canvas,
              -this.canvas.width / 2,
              -this.canvas.height / 2,
              this.canvas.width,
              this.canvas.height
            );
            this.ctx.restore();
          }
        } catch (err) {
          console.log("%c Canvas Error:\n", "background-color: #058377;", err);
        }
      }
    }
    async renderCube(tick) {
      this.FX.Three.Cube.objects[0].geometry.rotateX(0.0025);
      this.FX.Three.Cube.objects[0].geometry.rotateY(0.00125);
      this.FX.Three.Cube.stored.texture.needsUpdate = true;
      // this.FX.Three.Renderer.render(this.FX.Three.Scene, this.FX.Three.Camera);
    }
    async renderBubble(tick) {
      let rate = 0.0001 * Date.now();
      this.FX.Three.Bubbles.objects.forEach((bubble, i) => {
        bubble.position.x = 5 * Math.cos(rate + i);
        bubble.position.y = 5 * Math.sin(rate + i * 1.1);
      });
      this.FX.Three.Cube.stored.texture.needsUpdate = true;
      this.FX.Three.Scene.background.needsUpdate = true;
    }
    convertThree() {
      if (!this.Freeze) {
        this.ctx.save();
        this.ctx.rotate(0.0001);
        this.ctx.drawImage(
          this.threeCanv,
          (this.canvas.width - this.threeCanv.width) / 2,
          (this.canvas.height - this.threeCanv.height) / 2,
          this.threeCanv.width,
          this.threeCanv.height
        );
        this.ctx.restore();
      } else {
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate((180 * Math.PI) / 180);
        this.ctx.drawImage(
          this.threeCanv,
          -this.canvas.width / 2,
          -this.canvas.height / 2,
          this.canvas.width,
          this.canvas.height
        );
        this.ctx.restore();
      }
    }
    async updateRender(tick) {
      try {
        this.threeCanv.width = this.input.videoWidth;
        this.threeCanv.height = this.input.videoHeight;
        this.FX.Three.Renderer.setSize(
          this.threeCanv.width,
          this.threeCanv.height
        );
        JEEFACEFILTERAPI.resize();
        // this.FX.Three.Camera.aspect =
        // this.threeCanv.width / this.threeCanv.height;
      } catch (err) { }
    }
    async render(tick) {
      if (
        this.threeCanv.width !== this.input.videoHeight ||
        this.threeCanv.height !== this.input.videoHeight
      ) {
        this.updateRender(tick);
      }
      if (
        Object.keys(this.FX.Three).filter(
          (key) =>
            !this.FX.Three[key].uuid &&
            this.FX.Three[key].active &&
            this.FX.Three[key].objects
        ).length
      ) {
        if (this.FX.Three.Cube.active) {
          this.renderCube(tick);
        }
        if (this.FX.Three.Bubbles.active) {
          this.renderBubble(tick);
        }
        this.convertThree();
      } else {
        if (
          this.FX.Two.Bokeh.active ||
          (this.FX.Two.GreenScreen.type == "new" &&
            this.FX.Two.GreenScreen.active)
        ) {
          if (this.FX.Two.Bokeh.active) {
            await this.addBokeh(tick);
          }
          if (
            this.FX.Two.GreenScreen.type == "new" &&
            this.FX.Two.GreenScreen.active
          ) {
            await this.addGreen(tick);
          }
        } else {
          this.canvas.width = this.input.videoWidth;
          this.canvas.height = this.input.videoHeight;
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

          if (false) {
          } else {
            this.ctx.drawImage(
              this.input,
              0,
              0,
              this.canvas.width,
              this.canvas.height
            );
          }
        }
      }
    }
    async paintCanvas(tick) {
      if (!this.Freeze) {
        await this.render(tick);
        this.paint(tick);
      }
      window.requestAnimationFrame(
        function (tick) {
          this.paintCanvas(tick);
        }.bind(this)
      );
    }
  }

  if (localStorage["dev"] !== "optic") var Client = new GoogleMeetOptics();
  if (localStorage["dev"] === "optic") window.Client = new GoogleMeetOptics(0);
}
