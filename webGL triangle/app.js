var vertexShaderText = 
`
precision mediump float;
attribute vec2 vertPosition;
attribute vec3 vertColor;
varying vec3 fragColor;
void main() {
	fragColor = vertColor;
	gl_Position = vec4(vertPosition, 0.0, 1.0);
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
	[ //X, Y, 		R, G, B
		0.0, 0.5, 	0.9, 0.8, 0.1,
		-0.5, -0.5,	0.5, 0.4, 0.7,
		0.5, -0.5,	0.2, 0.7, 0.6
	];

	var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute Location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an indiviudal vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);

	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute Location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Size of an indiviudal vertex
		2 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	//
	// Main render loop
	//

	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3); //Type, vertices to skip, vertices

	console.log("hey");
}