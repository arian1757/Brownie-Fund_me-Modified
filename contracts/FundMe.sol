// SPDX-License-Identifier: MIT
// 1. Pragma
pragma solidity ^0.8.8;
// 2. Imports
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";
import './StringUtils.sol';


/**@title A sample Funding Contract
 * @author Patrick Collins
 * @notice This contract is for creating a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {
    // 3. Interfaces, Libraries, Contracts
error FundMe__NotOwner();
/// this was addded by me ///
error InsufficientSupport(string available, string need);

    // Type Declarations
    using PriceConverter for uint256;
    using StringUtils for uint256;

    // State variables
    /// this was added by me ///
    string private constant DEFAULT_PURPOSE = "others";

    uint256 public constant MINIMUM_USD = 50  ;
    address private immutable i_owner;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    AggregatorV3Interface private s_priceFeed;
    /// this was added by me ///
    struct FundClassification {
        uint256 education;
        uint256 podcasts;
        uint256 others;
    }
    FundClassification public fundClassification;
    struct EmergencyFunds {
        string goal;
        uint256 amount;
        uint256 apex;
        bool status;
    }
    EmergencyFunds public emergencyFunds;
 

    // Events 
    /// this was added by me ///
    event Thanks(bytes32 indexed message);
    // Modifiers
    modifier onlyOwner() {
        // require(msg.sender == i_owner);
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
    modifier activeFund() {
        
        require (emergencyFunds.status,"Emergency fund is not active");
        _;
    }
    modifier SufficientSupport(){
        if (msg.value.getConversionRate() < MINIMUM_USD) revert InsufficientSupport({
             available:StringUtils.toString(msg.value.getConversionRate()),
             need:StringUtils.toString(MINIMUM_USD) 
    });
        _;

    }

    // Functions Order:
    //// constructor
    //// receive
    //// fallback
    //// external
    //// public
    //// internal
    //// private
    //// view / pure

    constructor(address priceFeed) {
        s_priceFeed = AggregatorV3Interface(priceFeed);
        i_owner = msg.sender;
    }

    /// @notice Funds our contract based on the ETH/USD price
    function fundWithPurpose (string memory purpose) public payable SufficientSupport {
        /// this part of the code was changed to use less gas
        
        
        updateFunds(purpose, msg.value);
        emit Thanks ('Thank you for your supporting');

    }
    function fund() public payable SufficientSupport{
    
        updateFunds(DEFAULT_PURPOSE, msg.value);
        emit Thanks ('Thank you for your supporting');

    }
        
    function updateFunds(string memory purpose, uint256 amount) private{
        s_addressToAmountFunded[msg.sender] += amount;
        s_funders.push(msg.sender);
        /// It was changed by me 
        bytes32 purposeHash = keccak256(bytes(purpose));

        if (purposeHash == keccak256("education")) {
            fundClassification.education += amount;
        } else if (purposeHash == keccak256("podcasts")) {
            fundClassification.podcasts += amount;
        } else {
            fundClassification.others += amount;

        }
        

    }

    function withdraw() public onlyOwner  {
        for (
            uint256 funderIndex = 0;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
            
        }
        s_funders = new address[](0);
        fundClassification.education = 0;
        fundClassification.podcasts = 0;
        fundClassification.others = 0;
        
        // Transfer vs call vs Send
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        // mappings can't be in memory, sorry!
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        fundClassification.education = 0;
        fundClassification.podcasts = 0;
        fundClassification.others = 0;
        // payable(msg.sender).transfer(address(this).balance);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

    /** @notice Gets the amount that an address has funded
     *  @param fundingAddress the address of the funder
     *  @return the amount funded
     */
    function getAddressToAmountFunded(address fundingAddress)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[fundingAddress];
    }

    function getVersion() public view returns (uint256) {
        return s_priceFeed.version();
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
    /// this was added by me ///
    function getFundersCount() public view returns (uint256) {
        return s_funders.length;
    }
    //Get Funder Rank: Add a function that allows anyone to check their rank based on the amount they funded. The rank is determined by the position of their address in the sorted list of funders.
    function getFunderRank(address funderAddress) public view returns (uint256) {
        uint256 totalFunders = s_funders.length;
        uint256 rank = totalFunders;

        for (uint256 i = 0; i < totalFunders; i++) {
            if (s_addressToAmountFunded[s_funders[i]] < s_addressToAmountFunded[funderAddress]) {
                rank--;
            }
        }

        return rank;
    }
    function startEmergencyFund (string memory _goal, uint256 money) public onlyOwner{
        emergencyFunds = EmergencyFunds({
            goal : _goal,
            apex : money,
            status : true,
            amount : 0
        });

    }
    function emergencyFund() public payable activeFund {
        emergencyFunds.amount += msg.value;
        s_addressToAmountFunded[msg.sender] += msg.value;
        s_funders.push(msg.sender);
        emit Thanks ('Thank you for your supporting');
        uint256 budget = emergencyFunds.amount;
        if (budget >= emergencyFunds.apex) {
            emergencyFunds.amount = 0;
            (bool success, ) = i_owner.call{value: budget}("");
            require(success);
        }

    }
    function getEmergencyFund() public view returns (uint256) {
        return emergencyFunds.amount;
    }
    function getStatusFund() public view returns (uint256 education, 
    uint256 podcasts, uint256 others) {
        education = fundClassification.education;
        podcasts = fundClassification.podcasts;
        others = fundClassification.others;
    } 
    function getStatusEmergencyFund() public view returns (uint256 amount, uint256 apex) {
         amount = emergencyFunds.amount;
         apex = emergencyFunds.apex;

    }
        


}

//0x694AA1769357215DE4FAC081bf1f309aDC325306
