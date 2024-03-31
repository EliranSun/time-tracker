import React, {useEffect, useRef, useState} from 'react';
import Matter from 'matter-js';

function permission() {
    if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then(response => {
                // (optional) Do something after API prompt dismissed.
                if (response === "granted") {
                    alert("Permission granted");
                    window.addEventListener("devicemotion", (e) => {
                        // do something for 'e' here.
                    })
                } else {
                    alert(`Permission denied: ${response}`);
                }
            })
            .catch(error => {
                alert(`Error occurred: ${error}`);
            })
    } else {
        alert("DeviceMotionEvent is not defined");
    }
}


const GravitySimulation = () => {
    // Ref for the container to add the divs
    const sceneRef = useRef(null);
    const engineRef = useRef(Matter.Engine.create());
    const [motion, setMotion] = useState({x: 0, y: 0, z: 0});

    useEffect(() => {
        // Destructuring necessary modules from Matter.js
        const {Engine, Render, Bodies, World} = Matter;

        // Create an engine
        engineRef.current = Engine.create();

        // Create a renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engineRef.current,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false, // Set to false to see the shapes with solid colors
            },
        });

        // Create a bunch of rectangles (divs) with random positions and add them to the world
        const divBodies = [];
        for (let i = 0; i < 31; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight / 2;
            const radius = 10;
            const body = Bodies.circle(x, y, radius, {
                id: i,
                restitution: 0.8,
            });
            divBodies.push(body);
        }

        const wallsOptions = {
            isStatic: true,
            restitution: 0.8,
        }
        const floor = Bodies.rectangle(400, 610, 810, 60, wallsOptions);
        const wallLeft = Bodies.rectangle(0, 300, 60, 600, wallsOptions);
        const wallRight = Bodies.rectangle(window.innerWidth, 300, 60, 600, wallsOptions);

        World.add(engineRef.current.world, wallLeft);
        World.add(engineRef.current.world, wallRight);
        World.add(engineRef.current.world, divBodies);
        World.add(engineRef.current.world, floor);

        const handleOrientationChange = (event) => {
            const x = event.accelerationIncludingGravity.x;
            const y = event.accelerationIncludingGravity.y;
            const z = event.accelerationIncludingGravity.z;

            setMotion({x, y, z});

            engineRef.current.world.gravity.x = x;
            engineRef.current.world.gravity.y = y;
        };

        window.addEventListener('devicemotion', handleOrientationChange, true);

        // Running the engine
        Engine.run(engineRef.current);

        // Running the renderer
        Render.run(render);

        // Cleanup on component unmount
        return () => {
            Render.stop(render);
            World.clear(engineRef.current.world);
            Engine.clear(engineRef.current);
            render.canvas.remove();
            render.canvas = null;
            render.context = null;
            render.textures = {};
            window.removeEventListener('deviceorientation', handleOrientationChange);
        };
    }, []);

    return (
        <>
            {JSON.stringify(motion)}
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded user-select-none hover:bg-blue-700"
                onClick={permission}>
                Request Permission
            </button>
            <div ref={sceneRef}/>
        </>
    )
};

export default GravitySimulation;
