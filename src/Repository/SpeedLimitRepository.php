<?php

namespace App\Repository;

use App\Entity\SpeedLimit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use LongitudeOne\Spatial\PHP\Types\Geometry\Point;

/**
 * @extends ServiceEntityRepository<SpeedLimit>
 */
class SpeedLimitRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SpeedLimit::class);
    }

    public function findByPoint(Point $point): ?SpeedLimit
    {
        $geomFromText = "ST_GeomFromText('POINT(" . $point->getX() . ' ' . $point->getY() . ")', 4326)";
        return $this->createQueryBuilder('s')
            ->andWhere('ST_Intersects(s.area, ' . $geomFromText . ") = 't'")
            ->getQuery()
            ->getOneOrNullResult();
    }

    //    /**
    //     * @return SpeedLimit[] Returns an array of SpeedLimit objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('s.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?SpeedLimit
    //    {
    //        return $this->createQueryBuilder('s')
    //            ->andWhere('s.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
