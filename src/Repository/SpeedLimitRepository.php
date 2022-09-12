<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\SpeedLimit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

/**
 * @extends ServiceEntityRepository<SpeedLimit>
 *
 * @method SpeedLimit|null find($id, $lockMode = null, $lockVersion = null)
 * @method SpeedLimit|null findOneBy(array $criteria, array $orderBy = null)
 * @method SpeedLimit[]    findAll()
 * @method SpeedLimit[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SpeedLimitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SpeedLimit::class);
    }

    public function findByPoint(Point $point): ?SpeedLimit
    {
        return $this->createQueryBuilder('s')
            ->andWhere("ST_Intersects(s.area, ST_GeomFromText('POINT("
                . $point->getX() . ' ' . $point->getY() . ")', 4326)) = 't'")
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
