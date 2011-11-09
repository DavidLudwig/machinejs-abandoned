describe("Program", function () {
	var theProgram = null;
	
	beforeEach(function () {
		theProgram = new Program();
	});
	
	it("can contain instructions, but doesn't by default", function () {
		expect(theProgram.countInstructions()).toEqual(0);
	});
	
	it("can contain instructions, which can be retrieved later", function () {
		var instructionBodies = [
			function () {},
			function () {},
			function () {}
		];
		
		theProgram.addInstruction(Instruction_Exec, instructionBodies[0]);
		theProgram.addInstruction(Instruction_Exec, instructionBodies[1]);
		theProgram.addInstruction(Instruction_Exec, instructionBodies[2]);
		
		expect(theProgram.countInstructions()).toEqual(3);
		expect(theProgram.getInstruction(0)[0]).toEqual(Instruction_Exec);
		expect(theProgram.getInstruction(0)[1]).toBe(instructionBodies[0]);
		expect(theProgram.getInstruction(1)[0]).toEqual(Instruction_Exec);
		expect(theProgram.getInstruction(1)[1]).toBe(instructionBodies[1]);
		expect(theProgram.getInstruction(2)[0]).toEqual(Instruction_Exec);
		expect(theProgram.getInstruction(2)[1]).toBe(instructionBodies[2]);
	});
	
	it("allows program positions to be tagged", function () {
        theProgram.setTag("abc");
        theProgram.addInstruction(Instruction_NoOp);    // Instruction #0
        theProgram.setTag("def");
        theProgram.addInstruction(Instruction_NoOp);    // Instruction #1
        theProgram.addInstruction(Instruction_NoOp);    // Instruction #2
        theProgram.setTag("hji");
        theProgram.addInstruction(Instruction_NoOp);    // Instruction #3
        theProgram.setTag(123);
        theProgram.addInstruction(Instruction_NoOp);    // Instruction #4
        theProgram.setTag("the end");
        
        expect(theProgram.getTag("abc")).toEqual(0);
        expect(theProgram.getTag("def")).toEqual(1);
        expect(theProgram.getTag("hji")).toEqual(3);
        expect(theProgram.getTag("123")).toEqual(4);
        expect(theProgram.getTag("the end")).toEqual(5);    // The true end of a program is one-past the last available instruction.
	});
});
