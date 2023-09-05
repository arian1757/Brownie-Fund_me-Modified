from brownie import accounts,network, config, FundMe





def deploy_FundMe_2():
    account = get_account()
    print ('please give the address of PriceFeed contract')
    PriceFeed = input()
    

    Fund_me = FundMe.deploy(PriceFeed,{'from':account})



def get_account():
    if (network.show_active() == 'development'):
        return accounts[0]
    else :
        return accounts.add(config['wallets']['from_key'])




def main():
    
    deploy_FundMe_2()