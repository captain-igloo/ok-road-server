<?php

declare(strict_types=1);

namespace App\Rest;

use LongitudeOne\Spatial\PHP\Types\Geometry\Point;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Sensio\Bundle\FrameworkExtraBundle\Request\ParamConverter\ParamConverterInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class PointConverter implements ParamConverterInterface
{
    public function apply(Request $request, ParamConverter $configuration): bool
    {
        if (
            ($lat = $request->query->get('lat')) &&
            ($lng = $request->query->get('lng'))
        ) {
            $request->attributes->set($configuration->getName(), new Point($lng, $lat));
            return true;
        }
        throw new BadRequestHttpException();
    }

    public function supports(ParamConverter $configuration): bool
    {
        return $configuration->getClass() === Point::class;
    }
}
