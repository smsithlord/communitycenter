var SomSim=pc.createScript("somSim");SomSim.prototype.initialize=function(){var t=this.app;t.hasOwnProperty("som")||(t.som=this,this.isSomnium=!1,this.player=null,this.playerInputFrozen=!1)},SomSim.prototype.postInitialize=function(){if(!this.app.som.isSomnium){this.player=this.entity.parent.findByName("LocalPlayerSimulator"),this.player.enabled=!0;var t=this.app.root.children[0].findByTag("playerspawn");if(t.length>0){var i=t[Math.floor(Math.random()*t.length)];this.player.rigidbody.teleport(i.getPosition().clone(),i.getEulerAngles().clone())}setTimeout(function(){this.app.som.fire("player:joinWorld")}.bind(this),1e3)}},SomSim.prototype.webWorldInit=function(t){return new Promise(function(i,e){this.entity.findByName("Augment Platform Prefab").enabled=0!=t.type,i({success:!0})}.bind(this))},SomSim.prototype.setPlayerInputFrozen=function(t){this.playerInputFrozen=t};var SomWebWorld=pc.createScript("_som_webWorld");SomWebWorld.attributes.add("type",{title:"World Type",description:"Control how visitors load into your world. Augment Worlds get ADDED to the regular parcel build. Holistic Worlds REPLACE the regular parcel build.",type:"number",enum:[{"Holistic World":0},{"Augment World":1}],default:0}),SomWebWorld.attributes.add("allowedParcels",{title:"Allowed Parcels",type:"number",array:!0,description:"Explicitly list which PARCEL IDs that Somnium Space Web is allowed to use this world on. Leave blank to allow ANY parcel to use this world."}),SomWebWorld.prototype.postInitialize=function(){var e,l={id:this.id,title:this.title,url:this.url,type:this.type,allowEverywhere:this.allowEverywhere,allowedParcels:this.allowedParcels,worldMixing:this.worldMixing,mixWorlds:this.mixWorlds,apiVersion:this.apiVersion};if(this.app.som.isSomnium){e=this.app.root.children[0].findByTag("disableIfSom");for(o=0;o<e.length;o++)e[o].enabled=!1;e=this.app.root.children[0].findByTag("enableIfSom");for(o=0;o<e.length;o++)e[o].enabled=!0}else{e=this.app.root.children[0].findByTag("disableIfNotSom");for(var o=0;o<e.length;o++)e[o].enabled=!1;e=this.app.root.children[0].findByTag("enableIfNotSom");for(var o=0;o<e.length;o++)e[o].enabled=!0}this.app.som.webWorldInit(l).then((e=>{e.success?console.log("Web World Initialized"):console.log(e.errorMessage)}))};var PlayerMovement=pc.createScript("playerMovement");PlayerMovement.attributes.add("speed",{type:"number",default:.09}),PlayerMovement.prototype.initialize=function(){var e=this.app.root.findByName("Camera");this.cameraScript=e.script.cameraMovement},PlayerMovement.worldDirection=new pc.Vec3,PlayerMovement.tempDirection=new pc.Vec3,PlayerMovement.prototype.update=function(e){var t=this.app,r=PlayerMovement.worldDirection;r.set(0,0,0);var i=PlayerMovement.tempDirection,a=this.entity.forward,o=this.entity.right,n=0,p=0;if(!this.app.som.playerInputFrozen&&(t.keyboard.isPressed(pc.KEY_A)&&(n-=1),t.keyboard.isPressed(pc.KEY_D)&&(n+=1),t.keyboard.isPressed(pc.KEY_W)&&(p+=1),t.keyboard.isPressed(pc.KEY_S)&&(p-=1),0!==n||0!==p)){r.add(i.copy(a).mulScalar(p)),r.add(i.copy(o).mulScalar(n)),r.normalize();var s=new pc.Vec3(r.x*e,0,r.z*e);s.normalize().scale(this.speed),s.add(this.entity.getPosition());var c=this.cameraScript.eulers.x+180,y=new pc.Vec3(0,c,0);this.entity.rigidbody.teleport(s,y)}this.entity.anim.setFloat("xDirection",n),this.entity.anim.setFloat("zDirection",p)};var CameraMovement=pc.createScript("cameraMovement");CameraMovement.attributes.add("mouseSpeed",{type:"number",default:1.4,description:"Mouse Sensitivity"}),CameraMovement.prototype.initialize=function(){this.eulers=new pc.Vec3,this.touchCoords=new pc.Vec2,this.cameraInputDown=!1;var e=this.app;e.mouse.on("mousemove",this.onMouseMove,this),e.mouse.on("mousedown",this.onMouseDown,this),e.mouse.on("mouseup",this.onMouseUp,this),this.rayEnd=e.root.findByName("RaycastEndPoint"),this.on("destroy",(function(){e.mouse.off("mousemove",this.onMouseMove,this),e.mouse.off("mousedown",this.onMouseDown,this),e.mouse.off("mouseup",this.onMouseUp,this)}),this)},CameraMovement.prototype.postUpdate=function(e){if(!this.app.som.playerInputFrozen){var t=this.entity.parent,o=this.eulers.x+180,s=this.eulers.y,n=new pc.Vec3(-s,o,0);t.setEulerAngles(n),this.entity.setPosition(this.getWorldPoint()),this.entity.lookAt(t.getPosition())}},CameraMovement.prototype.onMouseMove=function(e){this.app.som.playerInputFrozen||(pc.Mouse.isPointerLocked()||this.cameraInputDown)&&(this.eulers.x-=this.mouseSpeed*e.dx/60%360,this.eulers.y+=this.mouseSpeed*e.dy/60%360,this.eulers.x<0&&(this.eulers.x+=360),this.eulers.y<0&&(this.eulers.y+=360))},CameraMovement.prototype.onMouseDown=function(e){this.app.som.playerInputFrozen||(this.cameraInputDown=!0)},CameraMovement.prototype.onMouseUp=function(e){this.app.som.playerInputFrozen||(this.cameraInputDown=!1)},CameraMovement.prototype.getWorldPoint=function(){var e=this.entity.parent.getPosition(),t=this.rayEnd.getPosition(),o=this.app.systems.rigidbody.raycastFirst(e,t);return o?o.point:t};var SomWebBrowser=pc.createScript("_som_webBrowser");SomWebBrowser.attributes.add("url",{type:"string"}),SomWebBrowser.prototype.initialize=function(){};