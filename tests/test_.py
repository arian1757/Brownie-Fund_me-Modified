import pytest
from brownie import FundMe, accounts, network, Contract, exceptions, config
@pytest.fixture
def test_fund_me():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )

    

    # Act
    fund_me.fund( {"value": 5*10**17,'from':account})

    # Assert
    assert fund_me.getAddressToAmountFunded(account.address) == 5*10**17 
    assert fund_me.getFundersCount() == 1
    assert fund_me.getFunderRank(account.address) == 1
    assert fund_me.getStatusFund() == (0, 0, 5*10**17 )


    


def test_purposed_fund_me():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )

    

    # Act
    fund_me.fundWithPurpose("education", {"value": 5 *10**17,'from':account})

    # Assert
    assert fund_me.getAddressToAmountFunded(account.address) == 5 *10**17
    assert fund_me.getFundersCount() == 1
    assert fund_me.getFunderRank(account.address) == 1
    assert fund_me.getStatusFund() == (5 *10**17, 0, 0)


def test_withdraw():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )


    # Act
    fund_me.fundWithPurpose("education", {"value": 5*10**17,'from':account})
    fund_me.withdraw()

    # Assert
    assert fund_me.getAddressToAmountFunded(account.address) == 0
    assert fund_me.getFundersCount() == 0
    assert fund_me.getStatusFund() == (0,0,0)
    
    


def test_cheaper_withdraw():
    # Arrange

    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )
    # Act
    fund_me.fundWithPurpose("education", {"value": 5*10**17})
    fund_me.cheaperWithdraw()

    # Assert
    assert fund_me.getAddressToAmountFunded(account.address) == 0
    assert fund_me.getFundersCount() == 0


def test_start_emergency_fund():
    # Arrange
   
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )

    # Act
    fund_me.startEmergencyFund("emergency_goal", 5*10**17)

    # Assert
    assert fund_me.getEmergencyFund() == 0
    assert fund_me.getStatusEmergencyFund() == (0,5*10**17)


def test_emergency_fund():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )
    fund_me.startEmergencyFund("emergency goal", 5*10**17)

    # Act
    fund_me.emergencyFund({"value": 4*10**17})

    # Assert
    assert fund_me.getEmergencyFund() == 4*10**17
    assert fund_me.getAddressToAmountFunded(account.address) == 4*10**17
    assert fund_me.getFundersCount() == 1


def test_emergency_fund_exceed_apex():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )
    fund_me.startEmergencyFund("help", 4*10**17)

    # Act
    fund_me.emergencyFund({"value": 5*10**17})

    # Assert
    assert fund_me.getEmergencyFund() == 0
    assert fund_me.getAddressToAmountFunded(account.address) == 5*10**17
    assert fund_me.getFundersCount() == 1





def test_get_funder():
    # Arrange
   
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )
    fund_me.fund( {"value": 5*10**17,'from':account})

    # Act
    funder = fund_me.getFunder(0)

    # Assert
    assert funder == account.address


def test_get_owner():
    # Arrange
    account = accounts[0]
    # account = accounts.add(config['wallets']['from_key'])
    price_feed_address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    
    fund_me = FundMe.deploy(
        price_feed_address,
        {'from': account}
    )

    # Act
    owner = fund_me.getOwner()

    # Assert
    assert owner == account.address


