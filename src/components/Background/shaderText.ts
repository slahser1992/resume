export const fragmentShaderPosition = "uniform float time;\n" +
  "\t\t\tuniform float delta;\n" +
  "\t\t\tvoid main()\t{\n" +
  "\t\t\t\tvec2 uv = gl_FragCoord.xy / resolution.xy;\n" +
  "\t\t\t\tvec4 tmpPos = texture2D( texturePosition, uv );\n" +
  "\t\t\t\tvec3 position = tmpPos.xyz;\n" +
  "\t\t\t\tvec3 velocity = texture2D( textureVelocity, uv ).xyz;\n" +
  "\t\t\t\tfloat phase = tmpPos.w;\n" +
  "\t\t\t\tphase = mod( ( phase + delta +\n" +
  "\t\t\t\t\tlength( velocity.xz ) * delta * 3. +\n" +
  "\t\t\t\t\tmax( velocity.y, 0.0 ) * delta * 6. ), 62.83 );\n" +
  "\t\t\t\tgl_FragColor = vec4( position + velocity * delta * 15. , phase );\n" +
  "\t\t\t}";

export const fragmentShaderVelocity = "uniform float time;\n" +
  "\t\t\tuniform float testing;\n" +
  "\t\t\tuniform float delta; // about 0.016\n" +
  "\t\t\tuniform float separationDistance; // 20\n" +
  "\t\t\tuniform float alignmentDistance; // 40\n" +
  "\t\t\tuniform float cohesionDistance; //\n" +
  "\t\t\tuniform float freedomFactor;\n" +
  "\t\t\tuniform vec3 predator;\n" +
  "\t\t\tconst float width = resolution.x;\n" +
  "\t\t\tconst float height = resolution.y;\n" +
  "\t\t\tconst float PI = 3.141592653589793;\n" +
  "\t\t\tconst float PI_2 = PI * 2.0;\n" +
  "\t\t\t// const float VISION = PI * 0.55;\n" +
  "\t\t\tfloat zoneRadius = 40.0;\n" +
  "\t\t\tfloat zoneRadiusSquared = 1600.0;\n" +
  "\t\t\tfloat separationThresh = 0.45;\n" +
  "\t\t\tfloat alignmentThresh = 0.65;\n" +
  "\t\t\tconst float UPPER_BOUNDS = BOUNDS;\n" +
  "\t\t\tconst float LOWER_BOUNDS = -UPPER_BOUNDS;\n" +
  "\t\t\tconst float SPEED_LIMIT = 9.0;\n" +
  "\t\t\tfloat rand( vec2 co ){\n" +
  "\t\t\t\treturn fract( sin( dot( co.xy, vec2(12.9898,78.233) ) ) * 43758.5453 );\n" +
  "\t\t\t}\n" +
  "\t\t\tvoid main() {\n" +
  "\t\t\t\tzoneRadius = separationDistance + alignmentDistance + cohesionDistance;\n" +
  "\t\t\t\tseparationThresh = separationDistance / zoneRadius;\n" +
  "\t\t\t\talignmentThresh = ( separationDistance + alignmentDistance ) / zoneRadius;\n" +
  "\t\t\t\tzoneRadiusSquared = zoneRadius * zoneRadius;\n" +
  "\t\t\t\tvec2 uv = gl_FragCoord.xy / resolution.xy;\n" +
  "\t\t\t\tvec3 birdPosition, birdVelocity;\n" +
  "\t\t\t\tvec3 selfPosition = texture2D( texturePosition, uv ).xyz;\n" +
  "\t\t\t\tvec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;\n" +
  "\t\t\t\tfloat dist;\n" +
  "\t\t\t\tvec3 dir; // direction\n" +
  "\t\t\t\tfloat distSquared;\n" +
  "\t\t\t\tfloat separationSquared = separationDistance * separationDistance;\n" +
  "\t\t\t\tfloat cohesionSquared = cohesionDistance * cohesionDistance;\n" +
  "\t\t\t\tfloat f;\n" +
  "\t\t\t\tfloat percent;\n" +
  "\t\t\t\tvec3 velocity = selfVelocity;\n" +
  "\t\t\t\tfloat limit = SPEED_LIMIT;\n" +
  "\t\t\t\tdir = predator * UPPER_BOUNDS - selfPosition;\n" +
  "\t\t\t\tdir.z = 0.;\n" +
  "\t\t\t\t// dir.z *= 0.6;\n" +
  "\t\t\t\tdist = length( dir );\n" +
  "\t\t\t\tdistSquared = dist * dist;\n" +
  "\t\t\t\tfloat preyRadius = 150.0;\n" +
  "\t\t\t\tfloat preyRadiusSq = preyRadius * preyRadius;\n" +
  "\t\t\t\t// move birds away from predator\n" +
  "\t\t\t\tif ( dist < preyRadius ) {\n" +
  "\t\t\t\t\tf = ( distSquared / preyRadiusSq - 1.0 ) * delta * 100.;\n" +
  "\t\t\t\t\tvelocity += normalize( dir ) * f;\n" +
  "\t\t\t\t\tlimit += 5.0;\n" +
  "\t\t\t\t}\n" +
  "\t\t\t\t// if (testing == 0.0) {}\n" +
  "\t\t\t\t// if ( rand( uv + time ) < freedomFactor ) {}\n" +
  "\t\t\t\t// Attract flocks to the center\n" +
  "\t\t\t\tvec3 central = vec3( 0., 0., 0. );\n" +
  "\t\t\t\tdir = selfPosition - central;\n" +
  "\t\t\t\tdist = length( dir );\n" +
  "\t\t\t\tdir.y *= 2.5;\n" +
  "\t\t\t\tvelocity -= normalize( dir ) * delta * 5.;\n" +
  "\t\t\t\tfor ( float y = 0.0; y < height; y++ ) {\n" +
  "\t\t\t\t\tfor ( float x = 0.0; x < width; x++ ) {\n" +
  "\t\t\t\t\t\tvec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;\n" +
  "\t\t\t\t\t\tbirdPosition = texture2D( texturePosition, ref ).xyz;\n" +
  "\t\t\t\t\t\tdir = birdPosition - selfPosition;\n" +
  "\t\t\t\t\t\tdist = length( dir );\n" +
  "\t\t\t\t\t\tif ( dist < 0.0001 ) continue;\n" +
  "\t\t\t\t\t\tdistSquared = dist * dist;\n" +
  "\t\t\t\t\t\tif ( distSquared > zoneRadiusSquared ) continue;\n" +
  "\t\t\t\t\t\tpercent = distSquared / zoneRadiusSquared;\n" +
  "\t\t\t\t\t\tif ( percent < separationThresh ) { // low\n" +
  "\t\t\t\t\t\t\t// Separation - Move apart for comfort\n" +
  "\t\t\t\t\t\t\tf = ( separationThresh / percent - 1.0 ) * delta;\n" +
  "\t\t\t\t\t\t\tvelocity -= normalize( dir ) * f;\n" +
  "\t\t\t\t\t\t} else if ( percent < alignmentThresh ) { // high\n" +
  "\t\t\t\t\t\t\t// Alignment - fly the same direction\n" +
  "\t\t\t\t\t\t\tfloat threshDelta = alignmentThresh - separationThresh;\n" +
  "\t\t\t\t\t\t\tfloat adjustedPercent = ( percent - separationThresh ) / threshDelta;\n" +
  "\t\t\t\t\t\t\tbirdVelocity = texture2D( textureVelocity, ref ).xyz;\n" +
  "\t\t\t\t\t\t\tf = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;\n" +
  "\t\t\t\t\t\t\tvelocity += normalize( birdVelocity ) * f;\n" +
  "\t\t\t\t\t\t} else {\n" +
  "\t\t\t\t\t\t\t// Attraction / Cohesion - move closer\n" +
  "\t\t\t\t\t\t\tfloat threshDelta = 1.0 - alignmentThresh;\n" +
  "\t\t\t\t\t\t\tfloat adjustedPercent = ( percent - alignmentThresh ) / threshDelta;\n" +
  "\t\t\t\t\t\t\tf = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;\n" +
  "\t\t\t\t\t\t\tvelocity += normalize( dir ) * f;\n" +
  "\t\t\t\t\t\t}\n" +
  "\t\t\t\t\t}\n" +
  "\t\t\t\t}\n" +
  "\t\t\t\t// this make tends to fly around than down or up\n" +
  "\t\t\t\t// if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);\n" +
  "\t\t\t\t// Speed Limits\n" +
  "\t\t\t\tif ( length( velocity ) > limit ) {\n" +
  "\t\t\t\t\tvelocity = normalize( velocity ) * limit;\n" +
  "\t\t\t\t}\n" +
  "\t\t\t\tgl_FragColor = vec4( velocity, 1.0 );\n" +
  "\t\t\t}\n";

export const birdVS = "attribute vec2 reference;\n" +
  "\t\t\tattribute float birdVertex;\n" +
  "\t\t\tattribute vec3 birdColor;\n" +
  "\t\t\tuniform sampler2D texturePosition;\n" +
  "\t\t\tuniform sampler2D textureVelocity;\n" +
  "\t\t\tvarying vec4 vColor;\n" +
  "\t\t\tvarying float z;\n" +
  "\t\t\tuniform float time;\n" +
  "\t\t\tvoid main() {\n" +
  "\t\t\t\tvec4 tmpPos = texture2D( texturePosition, reference );\n" +
  "\t\t\t\tvec3 pos = tmpPos.xyz;\n" +
  "\t\t\t\tvec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);\n" +
  "\t\t\t\tvec3 newPosition = position;\n" +
  "\t\t\t\tif ( birdVertex == 4.0 || birdVertex == 7.0 ) {\n" +
  "\t\t\t\t\t// flap wings\n" +
  "\t\t\t\t\tnewPosition.y = sin( tmpPos.w ) * 5.;\n" +
  "\t\t\t\t}\n" +
  "\t\t\t\tnewPosition = mat3( modelMatrix ) * newPosition;\n" +
  "\t\t\t\tvelocity.z *= -1.;\n" +
  "\t\t\t\tfloat xz = length( velocity.xz );\n" +
  "\t\t\t\tfloat xyz = 1.;\n" +
  "\t\t\t\tfloat x = sqrt( 1. - velocity.y * velocity.y );\n" +
  "\t\t\t\tfloat cosry = velocity.x / xz;\n" +
  "\t\t\t\tfloat sinry = velocity.z / xz;\n" +
  "\t\t\t\tfloat cosrz = x / xyz;\n" +
  "\t\t\t\tfloat sinrz = velocity.y / xyz;\n" +
  "\t\t\t\tmat3 maty =  mat3(\n" +
  "\t\t\t\t\tcosry, 0, -sinry,\n" +
  "\t\t\t\t\t0    , 1, 0     ,\n" +
  "\t\t\t\t\tsinry, 0, cosry\n" +
  "\t\t\t\t);\n" +
  "\t\t\t\tmat3 matz =  mat3(\n" +
  "\t\t\t\t\tcosrz , sinrz, 0,\n" +
  "\t\t\t\t\t-sinrz, cosrz, 0,\n" +
  "\t\t\t\t\t0     , 0    , 1\n" +
  "\t\t\t\t);\n" +
  "\t\t\t\tnewPosition =  maty * matz * newPosition;\n" +
  "\t\t\t\tnewPosition += pos;\n" +
  "\t\t\t\tz = newPosition.z;\n" +
  "\t\t\t\tvColor = vec4( birdColor, 1.0 );\n" +
  "\t\t\t\tgl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );\n" +
  "\t\t\t}\n";

export const birdFS = "varying vec4 vColor;\n" +
  "\t\t\tvarying float z;\n" +
  "\t\t\tuniform vec3 color;\n" +
  "\t\t\tvoid main() {\n" +
  "\t\t\t\t// Fake colors for now\n" +
  "\t\t\t\tfloat z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;\n" +
  "\t\t\t\tgl_FragColor = vec4( z2, z2, z2, 1. );\n" +
  "\t\t\t}";
