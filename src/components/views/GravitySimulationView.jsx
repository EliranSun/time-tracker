import React, {useRef, useCallback, useEffect, useMemo, useState} from 'react';
import Matter from 'matter-js';

const grantMotionPermission = async () => {
    if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
        const response = await DeviceMotionEvent.requestPermission();
        return response === "granted";
    } else {
        return false;
    }
};

const createBall = (Bodies) => {
    const x = window.innerWidth / 2;
    const y = 0; // start at the top of the screen
    const radius = 5;
    return Bodies.circle(x, y, radius, {
        restitution: 0.8,
        render: {
            fillStyle: "white",
            strokeStyle: "black",
            lineWidth: 2,
        }
    });
};

const createAndGetWorldInstance = (element) => {
    const {Engine, Render, Bodies, World} = Matter;
    const engine = Engine.create();
    const render = Render.create({
        element,
        engine,
        options: {
            width: window.innerWidth,
            height: window.innerHeight,
            wireframes: false,
            background: "transparent",
            showVelocity: true,
            showAngleIndicator: true
        },
    });

    const wallsOptions = {
        isStatic: true,
        restitution: 0.8,
        render: {
            fillStyle: "transparent",
            strokeStyle: "transparent",
        }
    };

    const floor = Bodies.rectangle(400, 610, 810, 60, wallsOptions);
    const wallLeft = Bodies.rectangle(0, 300, 60, 600, wallsOptions);
    const wallRight = Bodies.rectangle(window.innerWidth, 300, 60, 600, wallsOptions);

    World.add(engine.world, wallLeft);
    World.add(engine.world, wallRight);
    World.add(engine.world, floor);

    Engine.run(engine);
    Render.run(render);

    return {engine, bodies: Bodies, world: World};
}

const GravitySimulation = ({counter}) => {
    const sceneRef = useRef(null);
    const [isGranted, setIsGranted] = useState(false);
    const [bodies, setBodies] = useState([]);

    return (
        <>
            <button
                className="absolute top-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded user-select-none hover:bg-blue-700"
                onClick={async () => {
                    const isGranted = await grantMotionPermission();
                    if (!isGranted) {
                        return;
                    }

                    const {engine, bodies, world} = createAndGetWorldInstance(sceneRef.current);
                    const ball = createBall(bodies);
                    world.add(engine.world, ball);
                }}>
                Apply gravity
            </button>
            {isGranted ? <button onClick={() => {
                // const ball = createBall(bodies);
                // world.add(engine.world, ball);
            }}>
                ADD BALL
            </button> : null}
            <div ref={sceneRef}/>
        </>
    )
};

export default GravitySimulation;
