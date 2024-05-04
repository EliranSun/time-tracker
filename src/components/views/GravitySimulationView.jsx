import React, {useRef, useCallback} from 'react';
import Matter from 'matter-js';

const GravitySimulation = ({ counter }) => {
    // Ref for the container to add the divs
    const sceneRef = useRef(null);
    const engineRef = useRef(Matter.Engine.create());
    const permission = useCallback(() => {
        if (typeof (DeviceMotionEvent) !== "undefined" && typeof (DeviceMotionEvent.requestPermission) === "function") {
            DeviceMotionEvent.requestPermission()
                .then(response => {
                    if (response === "granted") {
                        const {Engine, Render, Bodies, World} = Matter;

                        const createBall = () => {
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

                        // Create an engine
                        engineRef.current = Engine.create();

                        // Create a renderer
                        const render = Render.create({
                            element: sceneRef.current,
                            engine: engineRef.current,
                            options: {
                                width: window.innerWidth,
                                height: window.innerHeight,
                                wireframes: false,
                                background: "transparent",
                                showVelocity: true,
                                showAngleIndicator: true
                            },
                        });

                        // Create a bunch of rectangles (divs) with random positions and add them to the world
                        const divBodies = [];

                        engineRef.current.gravity.y = 1;

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

                        World.add(engineRef.current.world, wallLeft);
                        World.add(engineRef.current.world, wallRight);
                        World.add(engineRef.current.world, divBodies);
                        World.add(engineRef.current.world, floor);

                        // Running the engine
                        Engine.run(engineRef.current);

                        // Running the renderer
                        Render.run(render);

                        // window.addEventListener("devicemotion", (event) => {
                        //     const {accelerationIncludingGravity} = event;
                        //
                        //     // Use accelerationIncludingGravity.x and accelerationIncludingGravity.y to adjust gravity
                        //     // You might need to scale these values to fit your simulation's needs
                        //     engineRef.current.world.gravity.x = accelerationIncludingGravity.x * 0.2;
                        //     engineRef.current.world.gravity.y = -accelerationIncludingGravity.y * 0.2;
                        // });

                        setInterval(() => {
                            const ball = createBall();
                            World.add(engineRef.current.world, ball);
                        }, 1000);
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
    }, []);

    return (
        <>
            <button
                className="absolute top-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded user-select-none hover:bg-blue-700"
                onClick={permission}>
                Apply gravity
            </button>
            <div ref={sceneRef}/>
        </>
    )
};

export default GravitySimulation;
