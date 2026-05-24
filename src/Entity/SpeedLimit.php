<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\SpeedLimitRepository;
use Doctrine\ORM\Mapping as ORM;
use JMS\Serializer\Annotation\Exclude;
use LongitudeOne\Spatial\PHP\Types\Geometry\MultiPolygon;

#[ORM\Entity(repositoryClass: SpeedLimitRepository::class)]
class SpeedLimit
{
    #[Exclude]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[ORM\Column]
    public ?int $speedLimit = null;

    #[ORM\Column(length: 255)]
    public ?string $description = null;

    #[Exclude]
    #[ORM\Column(type: 'MultiPolygon')]
    public ?MultiPolygon $area = null;
}
