for (let i = 0; i < 4; i++) {
  state.grids[i] = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,9,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
  state.rules[i] = creature2
}


const s = (sketch) => {
  var Engine = Matter.Engine
  var Render = Matter.Render
  var World = Matter.World
  var Bodies = Matter.Bodies
  var Composite = Matter.Composite
  var Body = Matter.Body

  var engine

  var v0, v1, v2, v3
  let boxes = []
  let bg

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth*0.9, sketch.windowHeight*0.9)
    sketch.noStroke()
    engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 0;
    // create two boxes and a ground
    v0 = Bodies.rectangle(sketch.width*0.2, sketch.height*sketch.random(0.2, 0.8), 25, 15, { frictionAir: 0.50, angle: sketch.random(0, 3.14) });
    v1 = Bodies.rectangle(sketch.width*0.4, sketch.height*sketch.random(0.2, 0.8), 25, 15, { frictionAir: 0.50, angle: sketch.random(0, 3.14) });
    v2 = Bodies.rectangle(sketch.width*0.6, sketch.height*sketch.random(0.2, 0.8), 25, 15, { frictionAir: 0.50, angle: sketch.random(0, 3.14) });
    v3 = Bodies.rectangle(sketch.width*0.8, sketch.height*sketch.random(0.2, 0.8), 25, 15, { frictionAir: 0.50, angle: sketch.random(0, 3.14) });

    // for (let i = 0; i < sketch.width/10; i++) {
    //   boxes[i] = Bodies.circle(sketch.width*sketch.random(0.2, 0.8), sketch.height*sketch.random(0.2, 0.8), 25, { frictionAir: 2.0 });
    // }
    // add all of the bodies to the world
    World.add(engine.world, [v0, v1, v2, v3].concat(boxes))
    // run the engine
    Engine.run(engine)

    bg = sketch.createGraphics(sketch.width, sketch.height)
    bg.noStroke()


  }

  sketch.draw = () => {
    let resx = sketch.width / 20
    let resy = sketch.height / 20
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 20; y++) {
        bg.fill(
          sketch.noise(
            x*0.2, y*0.2, sketch.frameCount*0.0005
            )>0.5?255:0,
            0, 0
        )
        bg.rect(x*resx, y*resy, resx, resy)
      }
    }

    sketch.image(bg, 0, 0)

    let bodies = [v0, v1, v2, v3]
    // sketch.loadPixels()
    bodies.forEach((body, j) => {
        // Wrap world
        Body.setPosition(body, sketch.createVector(
          (sketch.width + body.position.x) % sketch.width,
          (sketch.height + body.position.y) % sketch.height
        ))
        // Getting vertices of each object
        var vertices = body.vertices
        sketch.fill(255)
        sketch.beginShape()
        for (var i = 0; i < vertices.length; i++) {
          sketch.vertex(vertices[i].x, vertices[i].y)
        }
        sketch.endShape()
        sketch.fill(0)
        sketch.text(j, body.position.x, body.position.y)

        // get color under body
        let c = sketch.color(bg.get(body.position.x, body.position.y))
        sketch.fill(c)
        sketch.circle(body.position.x, body.position.y, 10)

        state.grids[j][15][1] = sketch.map(sketch.red(c), 0, 255, 0, 15)

    })

    boxes.forEach((body, j) => {
        // Wrap world
        Body.setPosition(body, sketch.createVector(
          (sketch.width + body.position.x) % sketch.width,
          (sketch.height + body.position.y) % sketch.height
        ))
        // Getting vertices of each object
        var vertices = body.vertices
        sketch.fill(0)
        sketch.beginShape()
        for (var i = 0; i < vertices.length; i++) {
          sketch.vertex(vertices[i].x, vertices[i].y)
        }
        sketch.endShape()
        sketch.fill(0)
    })

    for (let i = 0; i < bodies.length; i++) {
      let v = sketch.createVector(1, 0)
      let body = bodies[i]
      if (state.grids[i][0][1] == 1) {
        Body.setAngularVelocity(body, Math.PI/36)
        v.rotate(body.angle)
        Body.setVelocity(body, v)
      }
      if (state.grids[i][0][1] == 2) {
        Body.setAngularVelocity(body, -Math.PI/36)
        v.rotate(body.angle)
        Body.setVelocity(body, v)
      }
    }
  }
}

window.addEventListener('load', () => {
  let v = new p5(s, 'creatures')
})
