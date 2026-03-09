// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ServiceRegistry.sol";

/**
 * @title SubscriptionManager
 * @notice Manages subscriptions between agents and services
 * @dev Part of Reactive Agent Marketplace for Somnia Reactivity Hackathon
 */
contract SubscriptionManager {
    ServiceRegistry public serviceRegistry;

    struct Subscription {
        bytes32 id;
        bytes32 serviceId;
        address subscriber;
        string callbackUrl;
        bool active;
        uint256 subscribedAt;
        uint256 totalEventsReceived;
        uint256 totalPaid;
        uint256 balance; // Prepaid balance for events
    }

    mapping(bytes32 => Subscription) public subscriptions;
    mapping(address => bytes32[]) public userSubscriptions;
    mapping(bytes32 => bytes32[]) public serviceSubscriptions;

    event SubscriptionCreated(
        bytes32 indexed id,
        bytes32 indexed serviceId,
        address indexed subscriber,
        string callbackUrl
    );

    event SubscriptionCancelled(bytes32 indexed id);

    event EventDelivered(
        bytes32 indexed subscriptionId,
        bytes32 indexed eventHash,
        uint256 paymentAmount
    );

    event BalanceToppedUp(bytes32 indexed subscriptionId, uint256 amount);

    constructor(address _serviceRegistry) {
        serviceRegistry = ServiceRegistry(_serviceRegistry);
    }

    function subscribe(
        bytes32 serviceId,
        string calldata callbackUrl
    ) external payable returns (bytes32) {
        ServiceRegistry.Service memory service = serviceRegistry.getService(serviceId);
        require(service.active, "Service not active");
        require(service.provider != address(0), "Service not found");

        bytes32 id = keccak256(abi.encodePacked(msg.sender, serviceId, block.timestamp));

        Subscription storage sub = subscriptions[id];
        sub.id = id;
        sub.serviceId = serviceId;
        sub.subscriber = msg.sender;
        sub.callbackUrl = callbackUrl;
        sub.active = true;
        sub.subscribedAt = block.timestamp;
        sub.balance = msg.value;

        userSubscriptions[msg.sender].push(id);
        serviceSubscriptions[serviceId].push(id);

        emit SubscriptionCreated(id, serviceId, msg.sender, callbackUrl);
        return id;
    }

    function cancelSubscription(bytes32 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(sub.active, "Already inactive");

        sub.active = false;

        // Refund remaining balance
        if (sub.balance > 0) {
            uint256 refund = sub.balance;
            sub.balance = 0;
            payable(msg.sender).transfer(refund);
        }

        emit SubscriptionCancelled(subscriptionId);
    }

    function topUpBalance(bytes32 subscriptionId) external payable {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.subscriber == msg.sender, "Not subscriber");
        require(sub.active, "Subscription inactive");

        sub.balance += msg.value;
        emit BalanceToppedUp(subscriptionId, msg.value);
    }

    // Called by reactive system when event is delivered
    function recordEventDelivery(
        bytes32 subscriptionId,
        bytes32 eventHash,
        uint256 paymentAmount
    ) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.active, "Subscription inactive");
        require(sub.balance >= paymentAmount, "Insufficient balance");

        sub.balance -= paymentAmount;
        sub.totalEventsReceived++;
        sub.totalPaid += paymentAmount;

        // Transfer payment to service provider
        ServiceRegistry.Service memory service = serviceRegistry.getService(sub.serviceId);
        payable(service.provider).transfer(paymentAmount);

        emit EventDelivered(subscriptionId, eventHash, paymentAmount);
    }

    function getSubscription(bytes32 subscriptionId) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }

    function getUserSubscriptions(address user) external view returns (bytes32[] memory) {
        return userSubscriptions[user];
    }

    function getServiceSubscriptions(bytes32 serviceId) external view returns (bytes32[] memory) {
        return serviceSubscriptions[serviceId];
    }
}
