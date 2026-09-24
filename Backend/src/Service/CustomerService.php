<?php

namespace App\Service;

use App\Entity\Customer;
use Doctrine\ORM\EntityManagerInterface;

class CustomerService
{
    public function __construct(
        private readonly EntityManagerInterface $em
    ) {
    }

    /**
     * Create a new customer with default PROSPECT status.
     */
    public function createCustomer(Customer $customer): void
    {
        // Status is PROSPECT by default in the entity, but we ensure it here if needed.
        if (!$customer->getStatus()) {
            $customer->setStatus('PROSPECT');
        }

        $this->em->persist($customer);
        $this->em->flush();
    }
}
