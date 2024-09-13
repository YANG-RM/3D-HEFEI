import * as Cesium from "cesium";

var glsl$1 = "varying vec3 v_positionMC;varying vec3 v_positionEC;varying vec2 v_st;void main(){czm_materialInput materialInput;vec3 normalEC=normalize(czm_normal3D*czm_geodeticSurfaceNormal(v_positionMC,vec3(0.0),vec3(1.0)));\n#ifdef FACE_FORWARD\nnormalEC=faceforward(normalEC,vec3(0.0,0.0,1.0),-normalEC);\n#endif\nmaterialInput.s=v_st.s;materialInput.st=v_st;materialInput.str=vec3(v_st,0.0);materialInput.normalEC=normalEC;materialInput.tangentToEyeMatrix=czm_eastNorthUpToEyeCoordinates(v_positionMC,materialInput.normalEC);vec3 positionToEyeEC=-v_positionEC;materialInput.positionToEyeEC=positionToEyeEC;czm_material material=czm_getMaterial(materialInput);\n#ifdef FLAT\ngl_FragColor=vec4(material.diffuse+material.emission,material.alpha);\n#else\ngl_FragColor=czm_phong(normalize(positionToEyeEC),material,czm_lightDirectionEC);gl_FragColor.a=0.5;\n#endif\n}";

class WaterManager {
    constructor(viewer) {
        this._waters = [];
        this._normalMapUrl = "/images/waterNormals.jpg";
        this._viewer = viewer;
    }
    isArray(obj) {
        return (typeof obj == 'object') && obj.constructor == Array;
    }
    getPositions(entity) {
        var arr = entity.polygon.hierarchy._value;
        if (arr.positions && this.isArray(arr.positions))
            return arr.positions;
        return arr;
    }
    addWater(entities, height, waterParam) {
         // 遍历实体集合
        for (var i = 0; i < entities.length; i++) {
            // 获取当前实体
            const entity = entities[i];
            const arr = this.getPositions(entity);
            //水效果 创建水域多边形几何体
            const polygon = new Cesium.PolygonGeometry({
                height: height || 3.5,
                extrudedHeight: 3,
                polygonHierarchy: new Cesium.PolygonHierarchy(arr),
            });
             // 添加水域材质并渲染
            this._addWaterPrimitive(this._viewer, new Cesium.GeometryInstance({ geometry: polygon }), waterParam);
        }
    }
    // 内部方法：添加水域材质
    _addWaterPrimitive(viewer, geometryInstance, waterParam = {}) {
        const color = waterParam.color || "#006ab4";
        const waterPrimitive = viewer.scene.primitives.add(new Cesium.Primitive({
            geometryInstances: geometryInstance,
            // 设置外观，包含水面材质
            appearance: new Cesium.EllipsoidSurfaceAppearance({
                // 设置水面是否高于地面
                aboveGround: false,
                material: new Cesium.Material({
                    fabric: {
                      type: "Water",
                      uniforms: {
                        baseWaterColor: new Cesium.Color(
                          64 / 255.0,
                          157 / 255.0,
                          253 / 255.0,
                          0.6
                        ),
                        normalMap: "/images/waterNormals.jpg",
                        frequency: 1000.0,
                        animationSpeed: 0.01,
                        amplitude: 10,
                        specularIntensity: 8,
                      },
                    },
                  }),
            }),
            show: true
        }));
        this._waters.push(waterPrimitive);
        return waterPrimitive;
    }
}

export default WaterManager;












