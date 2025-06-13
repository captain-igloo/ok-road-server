<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Device;
use App\Entity\Location;
use App\Entity\SpeedLimit;
use App\Entity\User;
use DateTimeImmutable;
use DateTimeInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Location>
 */
class LocationRepository extends ServiceEntityRepository
{
    public const int MAX_RESULTS = 1000;

    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Location::class);
    }

    public function findLocations(Device $device, DateTimeInterface $from, DateTimeInterface $to): array
    {
        return $this->createQueryBuilder('l')
            ->leftJoin('l.speedLimit', 's')
            ->andWhere('l.device = :device')
            ->setParameter('device', $device)
            ->andWhere('l.timestamp >= :from')
            ->setParameter('from', $from)
            ->andWhere('l.timestamp <= :to')
            ->setParameter('to', $to)
            ->orderBy('l.speed - COALESCE(s.speedLimit, 100)', 'DESC')
            ->setMaxResults(self::MAX_RESULTS)
            ->getQuery()
            ->getResult();
    }

    public function findDemoLocations(Device $device, DateTimeInterface $from, DateTimeInterface $to): array
    {
        $demoEndDate = new DateTimeImmutable('2025-01-10 00:00:00');
        $now = new DateTimeImmutable(date('Y-m-d 00:00:00'));
        $diff = $now->getTimeStamp() - $demoEndDate->getTimestamp();
        $shiftedFrom = new DateTimeImmutable(sprintf('@%d', $from->getTimestamp() - $diff));
        $shiftedTo = new DateTimeImmutable(sprintf('@%d', $to->getTimestamp() - $diff));
        return array_map(function ($location) use ($diff) {
            $location->setTimestamp(
                new DateTimeImmutable(sprintf('@%d', $location->getTimestamp()->getTimestamp() + $diff)),
            );
            return $location;
        }, $this->findLocations($device, $shiftedFrom, $shiftedTo));
    }
}
