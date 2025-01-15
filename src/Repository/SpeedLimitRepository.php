<?php

namespace App\Repository;

use App\Entity\SpeedLimit;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query\ResultSetMappingBuilder;
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
        $rsm = new ResultSetMappingBuilder($this->getEntityManager());
        $rsm->addRootEntityFromClassMetadata(SpeedLimit::class, 's');

        $geomFromText = "ST_GeomFromText('POINT(" . $point->getX() . ' ' . $point->getY() . ")', 4326)";

        // don't select speed_limit.area, it's not needed and will chew up memory if the polygon has a lot of vertices.
        return $this->getEntityManager()
            ->createNativeQuery(
                'SELECT
                    id, speed_limit, description
                FROM
                    speed_limit AS s
                WHERE
                    ST_Intersects(s.area, ' . $geomFromText . ')',
                $rsm,
            )
            ->getOneOrNullResult();
    }
}
