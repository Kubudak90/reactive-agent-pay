// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ServiceRegistry.sol";
import "./SubscriptionManager.sol";

/**
 * @title PaymentProcessor
 * @notice Handles USDC micropayments for reactive events (x402 compatible)
 * @dev Part of Reactive Agent Marketplace for Somnia Reactivity Hackathon
 */
contract PaymentProcessor {
    ServiceRegistry public serviceRegistry;
    SubscriptionManager public subscriptionManager;
    
    address public usdcToken;
    address public owner;

    struct Payment {
        bytes32 id;
        bytes32 subscriptionId;
        bytes32 eventHash;
        uint256 amount;
        address token;
        uint256 timestamp;
        bool settled;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(bytes32 => bytes32[]) public subscriptionPayments;

    event PaymentInitiated(
        bytes32 indexed id,
        bytes32 indexed subscriptionId,
        bytes32 indexed eventHash,
        uint256 amount,
        address token
    );

    event PaymentSettled(bytes32 indexed id, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        address _serviceRegistry,
        address _subscriptionManager,
        address _usdcToken
    ) {
        serviceRegistry = ServiceRegistry(_serviceRegistry);
        subscriptionManager = SubscriptionManager(_subscriptionManager);
        usdcToken = _usdcToken;
        owner = msg.sender;
    }

    // x402-style payment processing
    function processPayment(
        bytes32 subscriptionId,
        bytes32 eventHash,
        uint256 amount,
        bytes calldata signature
    ) external returns (bytes32) {
        // Verify subscription exists and is active
        SubscriptionManager.Subscription memory sub = subscriptionManager.getSubscription(subscriptionId);
        require(sub.active, "Subscription inactive");

        // Create payment record
        bytes32 paymentId = keccak256(abi.encodePacked(
            subscriptionId,
            eventHash,
            block.timestamp
        ));

        Payment storage payment = payments[paymentId];
        payment.id = paymentId;
        payment.subscriptionId = subscriptionId;
        payment.eventHash = eventHash;
        payment.amount = amount;
        payment.token = usdcToken;
        payment.timestamp = block.timestamp;
        payment.settled = false;

        subscriptionPayments[subscriptionId].push(paymentId);

        emit PaymentInitiated(paymentId, subscriptionId, eventHash, amount, usdcToken);
        return paymentId;
    }

    function settlePayment(bytes32 paymentId) external {
        Payment storage payment = payments[paymentId];
        require(!payment.settled, "Already settled");
        
        // Get subscription and service info
        SubscriptionManager.Subscription memory sub = subscriptionManager.getSubscription(payment.subscriptionId);
        ServiceRegistry.Service memory service = serviceRegistry.getService(sub.serviceId);

        payment.settled = true;

        emit PaymentSettled(paymentId, block.timestamp);
    }

    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }

    function getSubscriptionPayments(bytes32 subscriptionId) external view returns (bytes32[] memory) {
        return subscriptionPayments[subscriptionId];
    }

    function updateUsdcToken(address _usdcToken) external onlyOwner {
        usdcToken = _usdcToken;
    }
}
