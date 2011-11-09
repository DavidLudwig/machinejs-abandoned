
describe("Assembler", function () {
	theAssembler = null;
	
	beforeEach(function () {
		this.addMatchers({
			toBeInstructionOfType: function (expected) {
				return (this.actual != null) && (this.actual[0] == expected);
			}
		});
		
		theAssembler = new Assembler();
	});
	
	it("can assemble an empty program", function () {
		var code = "";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram).toBeDefined();
		expect(theProgram.countInstructions()).toEqual(0);
	});
	
	it("can assemble a single NoOp instruction", function () {
		var code = "noop";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram.countInstructions()).toEqual(1);
		expect(theProgram.getInstruction(0)).toBeInstructionOfType(Instruction_NoOp);
	});
	
	it("can assemble a multiple NoOp instructions, while ignoring empty lines and preceding whitespace", function () {
		var code = "noop \n\
					noop \n\
					\n\
					noop \n\
					     \n\
					noop \n\
					noop";

		var theProgram = theAssembler.assemble(code);
		expect(theProgram.countInstructions()).toEqual(5);
		for (var i = 0; i < 5; i++) {
			expect(theProgram.getInstruction(i)).toBeInstructionOfType(Instruction_NoOp);
		}
	});
	
	it("can assemble Exec instructions", function () {
		var code = "exec 1 + 2; \n\
					exec 3 + 4; \n\
					exec 52 * 3;";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram.countInstructions()).toEqual(3);
		expect(theProgram.getInstruction(0)).toBeInstructionOfType(Instruction_Exec);
		expect(theProgram.getInstruction(1)).toBeInstructionOfType(Instruction_Exec);
		expect(theProgram.getInstruction(2)).toBeInstructionOfType(Instruction_Exec);
	});
	
	it("can read in tags", function () {
		var code = ":Start \n\
						noop \n\
						noop \n\
					:Position With Spaces \n\
						noop \n\
					:Final Position";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram.getTag("Start")).toEqual(0);
		expect(theProgram.getTag("Position With Spaces")).toEqual(2);
		expect(theProgram.getTag("Final Position")).toEqual(3);
	});
	
	it("can assemble jump-to-tag instructions", function () {
		var code = "jmp Later \n\
					noop \n\
					:Later \n\
					jmp Even Later \n\
					noop \n\
					noop \n\
					:Even Later";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram.getInstruction(0)).toBeInstructionOfType(Instruction_JumpToTag);
		expect(theProgram.getInstruction(0)[1]).toEqual("Later");
		expect(theProgram.getInstruction(2)).toBeInstructionOfType(Instruction_JumpToTag);
		expect(theProgram.getInstruction(2)[1]).toEqual("Even Later");
	});
	
	it("can assemble conditional-jump-to-tag instructions", function () {
		var code = "exec this.n = 5					\n\
					:Loop Start						\n\
						exec	this.n--			\n\
						exec	return (this.n > 0)	\n\
						jmpcond Loop Start";
		var theProgram = theAssembler.assemble(code);
		expect(theProgram.getInstruction(3)).toBeInstructionOfType(Instruction_ConditionalJumpToTag);
		expect(theProgram.getInstruction(3)[1]).toEqual("Loop Start");
	});
	
	describe("With Code Execution", function () {
		theMachine = null;
		
		beforeEach(function () {
			theMachine = new Machine();
		})
		
		it("can assemble and run an empty program", function () {
			var code = "";
			var theProgram = theAssembler.assemble(code);
			theMachine.loadProgram(theProgram);
			expect(theMachine.getInstructionPointer()).toEqual(0);
		});
		
		it("can run programs with multiple exec functions, with data shared among them", function () {
			var code = "exec this.foo = this.foo * 2; \n\
						exec this.foo += 2;";
			var theProgram = theAssembler.assemble(code);
			theMachine.loadProgram(theProgram);
			var execEnv = new Array();
			execEnv.foo = 10;
			theMachine.setExecEnvironment(execEnv);
			theMachine.run();
			expect(execEnv.foo).toEqual(22);
		});
	});
});
