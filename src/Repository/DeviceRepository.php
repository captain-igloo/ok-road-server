<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Device;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Device>
 */
class DeviceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Device::class);
    }

    public function findById(User $user, int $deviceId)
    {
        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
        $rsm->addRootEntityFromClassMetadata(Device::class, 'd');

        $query = $this->getEntityManager()
            ->createNativeQuery(
                'SELECT
                    d.*
                FROM
                    device AS d
                LEFT JOIN
                    friend AS f
                ON
                    d.user_id = f.friend_id
                WHERE
                    d.id = :deviceId
                    AND (d.user_id = :userId OR d.user_id = f.friend_id)',
                $rsm
            );
        $query->setParameter('deviceId', $deviceId);
        $query->setParameter('userId', $user->getId());
        return $query->getOneOrNullResult();
    }

    public function findByName(User $user, string $name)
    {
        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
        $rsm->addRootEntityFromClassMetadata(Device::class, 'd');

        $query = $this->getEntityManager()
            ->createNativeQuery(
                'SELECT
                    d.*
                FROM
                    device AS d
                LEFT JOIN
                    friend AS f
                ON
                    d.user_id = f.friend_id
                WHERE
                    d.name = :name
                    AND (d.user_id = :userId OR d.user_id = f.friend_id)',
                $rsm
            );
        $query->setParameter('name', $name);
        $query->setParameter('userId', $user->getId());
        return $query->getOneOrNullResult();
    }

    public function findByUser(User $user)
    {
        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
        $rsm->addRootEntityFromClassMetadata(Device::class, 'd');

        $query = $this->getEntityManager()
            ->createNativeQuery(
                'SELECT
                    d.*
                FROM
                    device AS d
                LEFT JOIN
                    friend AS f
                ON
                    d.user_id = f.friend_id
                WHERE
                    d.user_id = :userId OR d.user_id = f.friend_id',
                $rsm
            );
        $query->setParameter('userId', $user->getId());
        return $query->getResult();
    }
}
