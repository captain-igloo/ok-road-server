<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\User;
use DateTimeInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Location>
 */
class LocationRepository extends ServiceEntityRepository
{
    private const int MAX_RESULTS = 1000;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Location::class);
    }

    public function findLocations(Device $device, DateTimeInterface $from, DateTimeInterface $to): array
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.device = :device')
            ->setParameter('device', $device)
            ->andWhere('l.timestamp >= :from')
            ->setParameter('from', $from)
            ->andWhere('l.timestamp <= :to')
            ->setParameter('to', $to)
            ->orderBy('l.timestamp', 'DESC')
            ->setMaxResults(self::MAX_RESULTS)
            ->getQuery()
            ->getResult();
    }
}
