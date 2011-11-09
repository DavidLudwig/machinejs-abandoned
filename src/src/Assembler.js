
function Assembler() {
	// this.foo = 123;
}

// Program Management

Assembler.prototype.assemble = function (code) {
	var theProgram = new Program();
	
	var codeLines = code.split("\n");
	//console.log("code lines: " + codeLines.length);
	
	for (var lineNumber = 1; lineNumber <= codeLines.length; lineNumber++) {
		var codeLine = codeLines[lineNumber - 1];
		//console.log("raw code: " + codeLine);

		// strip preceding whitespace
		codeLine = codeLine.replace(/^\s*/, "");
		
		// strip trailing whitespace
		codeLine = codeLine.replace(/\s*$/, "");

		// do nothing if there's no data in the line
		if (codeLine.length == 0) {
			continue;
		}
		
		// check for a tag
		if (codeLine[0] == ":") {
			var tagName = codeLine.replace(/^\:/, "");
			//console.log("tag: '" + tagName + "'");
			theProgram.setTag(tagName);
			continue;
		}
		
		// retrieve instruction name
		var instruction = codeLine.replace(/^([a-z]+).*/, "$1");
		//console.log("instruction: " + instruction);
		
		// interpret the line
		switch (instruction) {
			case "noop":
				theProgram.addInstruction(Instruction_NoOp);
				break;
				
			case "exec":
				var execCode = codeLine.replace(/^[a-z]+/, "");
				//console.log("execCode @ " + lineNumber + ": '" + execCode + "'");
				var theFunction = new Function(execCode);
				theProgram.addInstruction(Instruction_Exec, theFunction);
				break;
			
			case "jmp":
				var tagName = codeLine.replace(/^[a-z]+ /, "");
				theProgram.addInstruction(Instruction_JumpToTag, tagName);
				break;
			
			case "jmpcond":
				var tagName = codeLine.replace(/^[a-z]+ /, "");
				theProgram.addInstruction(Instruction_ConditionalJumpToTag, tagName);
				break;
			
			//case ""
		}
	}
	
	return theProgram;
}
