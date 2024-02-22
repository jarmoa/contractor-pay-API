const contractService = require('./contractService');
const { AppError } = require('../middleware/errorHandler');

// Mock the ContractController module
jest.mock('../controllers/contractController', () => ({
  getContract: jest.fn(),
  getNonTerminatedContracts: jest.fn(),
}));

describe("contractService", () => {
  const mockContract = { id: 1, details: "Mock contract details" };
  const mockContracts = [
    mockContract,
    { id: 2, details: "Another mock contract" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getContract returns the correct contract", async () => {
    const contractId = 1;
    const profileId = 1;
    require("../controllers/contractController").getContract.mockResolvedValue(
      mockContract
    );

    const contract = await contractService.getContract(contractId, profileId);

    expect(contract).toEqual(mockContract);
    expect(
      require("../controllers/contractController").getContract
    ).toHaveBeenCalledWith(contractId, profileId);
  });

  test("getNonTerminatedContracts returns the correct contracts", async () => {
    const profileId = 1;
    require("../controllers/contractController").getNonTerminatedContracts.mockResolvedValue(
      mockContracts
    );

    const contracts = await contractService.getNonTerminatedContracts(
      profileId
    );

    expect(contracts).toEqual(mockContracts);
    expect(
      require("../controllers/contractController").getNonTerminatedContracts
    ).toHaveBeenCalledWith(profileId);
  });
});