var vertexShaderText = 
`
precision mediump float;
attribute vec3 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
void main() {
	fragColor = vertColor;
	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`

var fragmentShaderText =
`
precision mediump float;
varying vec3 fragColor;
void main() {
	gl_FragColor = vec4(fragColor, 1.0);
}
`

function toRadians(d){
	radians = d * (Math.PI/180);
	return radians;
}

var InitDemo = function() {
	console.log("hey");

	// Init webGL

	var canvas = document.getElementById('surface');
	var gl = canvas.getContext('webgl');

	if (!gl){
		console.log("Your browser does not support webGL without falling back on experimental.")
		gl = canvas.getContext('experimental-webgl');
	}

	if(!gl){
		alert("Your browser does not support webGL")
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.error("ERROR Compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.error("ERROR Compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error("ERROR Linking program!", gl.getProgramInfoLog(program));
		return;
	}

	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
		console.error("ERROR Validating program!", gl.getProgramInfoLog(program));
			return;
	}

	//
	// Create Buffer
	//
	var triangleVertices =
	[ //X, 	 Y,   Z			R, 	 G,   B
		0.0, 0.5, 0.0,		0.9, 0.8, 0.1,
		-0.5,-0.5, 0.0,		0.5, 0.4, 0.7,
		0.5, -0.5, 0.0,		0.2, 0.7, 0.6
	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute Location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an indiviudal vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute Location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an indiviudal vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Tell webGL state machine which program should be active.
	gl.useProgram(program);
	var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
	var matViewUniformLocation = gl.getUniformLocation(program, "mView");
	var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -3], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, toRadians(45), canvas.width / canvas.height, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


	//
	// Main render loop
	//

	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function(){
		angle = performance.now() / 1000 / 4 * 2 * Math.PI;
		glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]); // Output, Original Matrix, Angle, Axis of rotation (world)
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		gl.clearColor(0.75, 0.85, 0.8, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		gl.drawArrays(gl.TRIANGLES, 0, 3); //Type, vertices to skip, vertices

		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);

	
	

	
}