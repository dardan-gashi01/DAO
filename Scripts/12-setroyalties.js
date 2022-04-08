import sdk from './1-SDK.js'

const NFTDrop = sdk.getEditionDrop("0x6b94A4e94Aed2D72dC12AF523BbE0d168f439Ba7");

(async () => {
    NFTDrop.royalty.setDefaultRoyaltyInfo({
        seller_fee_basis_points: 500, // 5%
        fee_recipient: "0x54000321f966e0469367415436594De58e3BC304"
    });
})();
